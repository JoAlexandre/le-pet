import 'package:sqflite/sqflite.dart';
import '../../../../core/infrastructure/database/database_provider.dart';
import '../../../../core/infrastructure/errors/exceptions.dart';
import '../models/company_model.dart';
import 'company_local_datasource.dart';

class CompanyLocalDatasourceImpl implements CompanyLocalDatasource {
  final DatabaseProvider _databaseProvider;

  static const String _tableName = 'companies';

  const CompanyLocalDatasourceImpl({required DatabaseProvider databaseProvider})
    : _databaseProvider = databaseProvider;

  @override
  Future<List<CompanyModel>> getCachedCompanies() async {
    try {
      final db = await _databaseProvider.database;
      final rows = await db.query(_tableName, orderBy: 'tradeName ASC');
      return rows.map((row) => CompanyModel.fromRow(row)).toList();
    } catch (e) {
      throw CacheException('Erro ao buscar empresas em cache: $e');
    }
  }

  @override
  Future<void> cacheCompanies(List<CompanyModel> companies) async {
    try {
      final db = await _databaseProvider.database;
      final batch = db.batch();
      batch.delete(_tableName);
      for (final company in companies) {
        batch.insert(
          _tableName,
          company.toRow(),
          conflictAlgorithm: ConflictAlgorithm.replace,
        );
      }
      await batch.commit(noResult: true);
    } catch (e) {
      throw CacheException('Erro ao salvar empresas em cache: $e');
    }
  }

  @override
  Future<void> cacheCompany(CompanyModel company) async {
    try {
      final db = await _databaseProvider.database;
      await db.insert(
        _tableName,
        company.toRow(),
        conflictAlgorithm: ConflictAlgorithm.replace,
      );
    } catch (e) {
      throw CacheException('Erro ao salvar empresa em cache: $e');
    }
  }
}
