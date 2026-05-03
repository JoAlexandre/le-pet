import 'package:sqflite/sqflite.dart';
import '../../../../core/infrastructure/database/database_provider.dart';
import '../../../../core/infrastructure/errors/exceptions.dart';
import '../models/vaccine_record_model.dart';
import 'vaccine_local_datasource.dart';

class VaccineLocalDatasourceImpl implements VaccineLocalDatasource {
  final DatabaseProvider _databaseProvider;

  static const String _tableName = 'vaccine_records';

  const VaccineLocalDatasourceImpl({required DatabaseProvider databaseProvider})
    : _databaseProvider = databaseProvider;

  @override
  Future<List<VaccineRecordModel>> getCachedVaccinesByAnimal(
    String animalId,
  ) async {
    try {
      final db = await _databaseProvider.database;
      final rows = await db.query(
        _tableName,
        where: 'animalId = ?',
        whereArgs: [animalId],
        orderBy: 'applicationDate DESC',
      );
      return rows.map((row) => VaccineRecordModel.fromRow(row)).toList();
    } catch (e) {
      throw CacheException('Erro ao buscar vacinas em cache: $e');
    }
  }

  @override
  Future<void> cacheVaccinesForAnimal(
    String animalId,
    List<VaccineRecordModel> records,
  ) async {
    try {
      final db = await _databaseProvider.database;
      final batch = db.batch();
      // Remove registros antigos do animal antes de inserir novos
      batch.delete(_tableName, where: 'animalId = ?', whereArgs: [animalId]);
      for (final record in records) {
        batch.insert(
          _tableName,
          record.toRow(),
          conflictAlgorithm: ConflictAlgorithm.replace,
        );
      }
      await batch.commit(noResult: true);
    } catch (e) {
      throw CacheException('Erro ao salvar vacinas em cache: $e');
    }
  }

  @override
  Future<void> removeVaccine(String id) async {
    try {
      final db = await _databaseProvider.database;
      await db.delete(_tableName, where: 'id = ?', whereArgs: [id]);
    } catch (e) {
      throw CacheException('Erro ao remover vacina do cache: $e');
    }
  }
}
