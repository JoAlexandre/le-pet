import 'package:sqflite/sqflite.dart';
import '../../../../core/infrastructure/database/database_provider.dart';
import '../../../../core/infrastructure/errors/exceptions.dart';
import '../models/animal_model.dart';
import 'animal_local_datasource.dart';

class AnimalLocalDatasourceImpl implements AnimalLocalDatasource {
  final DatabaseProvider _databaseProvider;

  static const String _tableName = 'animals';

  const AnimalLocalDatasourceImpl({required DatabaseProvider databaseProvider})
    : _databaseProvider = databaseProvider;

  @override
  Future<List<AnimalModel>> getCachedAnimals() async {
    try {
      final db = await _databaseProvider.database;
      final rows = await db.query(
        _tableName,
        where: 'isActive = ?',
        whereArgs: [1],
        orderBy: 'name ASC',
      );
      return rows.map((row) => AnimalModel.fromJson(_rowToJson(row))).toList();
    } catch (e) {
      throw CacheException('Erro ao buscar animais em cache: $e');
    }
  }

  @override
  Future<void> cacheAnimals(List<AnimalModel> animals) async {
    try {
      final db = await _databaseProvider.database;
      final batch = db.batch();
      for (final animal in animals) {
        batch.insert(
          _tableName,
          _animalToRow(animal),
          conflictAlgorithm: ConflictAlgorithm.replace,
        );
      }
      await batch.commit(noResult: true);
    } catch (e) {
      throw CacheException('Erro ao salvar animais em cache: $e');
    }
  }

  @override
  Future<AnimalModel?> getCachedAnimal(String id) async {
    try {
      final db = await _databaseProvider.database;
      final rows = await db.query(
        _tableName,
        where: 'id = ?',
        whereArgs: [id],
        limit: 1,
      );
      if (rows.isEmpty) return null;
      return AnimalModel.fromJson(_rowToJson(rows.first));
    } catch (e) {
      throw CacheException('Erro ao buscar animal em cache: $e');
    }
  }

  @override
  Future<void> cacheAnimal(AnimalModel animal) async {
    try {
      final db = await _databaseProvider.database;
      await db.insert(
        _tableName,
        _animalToRow(animal),
        conflictAlgorithm: ConflictAlgorithm.replace,
      );
    } catch (e) {
      throw CacheException('Erro ao salvar animal em cache: $e');
    }
  }

  @override
  Future<void> removeAnimal(String id) async {
    try {
      final db = await _databaseProvider.database;
      await db.update(
        _tableName,
        {'isActive': 0},
        where: 'id = ?',
        whereArgs: [id],
      );
    } catch (e) {
      throw CacheException('Erro ao remover animal do cache: $e');
    }
  }

  @override
  Future<void> clearAll() async {
    try {
      final db = await _databaseProvider.database;
      await db.delete(_tableName);
    } catch (e) {
      throw CacheException('Erro ao limpar cache de animais: $e');
    }
  }

  Map<String, dynamic> _animalToRow(AnimalModel animal) {
    return {
      'id': animal.id,
      'tutorId': animal.tutorId,
      'name': animal.name,
      'species': animal.species.toApiString(),
      'breed': animal.breed,
      'gender': animal.gender.toApiString(),
      'birthDate': animal.birthDate?.toIso8601String(),
      'weight': animal.weight,
      'color': animal.color,
      'microchipNumber': animal.microchipNumber,
      'photoUrl': animal.photoUrl,
      'allergies': animal.allergies,
      'notes': animal.notes,
      'isActive': animal.isActive ? 1 : 0,
      'createdAt': animal.createdAt?.toIso8601String(),
    };
  }

  Map<String, dynamic> _rowToJson(Map<String, dynamic> row) {
    return {
      'id': row['id'],
      'tutorId': row['tutorId'],
      'name': row['name'],
      'species': row['species'],
      'breed': row['breed'],
      'gender': row['gender'],
      'birthDate': row['birthDate'],
      'weight': row['weight'],
      'color': row['color'],
      'microchipNumber': row['microchipNumber'],
      'photoUrl': row['photoUrl'],
      'allergies': row['allergies'],
      'notes': row['notes'],
      'isActive': row['isActive'] == 1,
      'createdAt': row['createdAt'],
    };
  }
}
