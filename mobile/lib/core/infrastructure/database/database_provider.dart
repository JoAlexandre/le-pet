import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

class DatabaseProvider {
  static final DatabaseProvider _instance = DatabaseProvider._internal();
  static Database? _database;
  static Future<Database>? _initializationFuture;

  static const String _databaseName = 'lepet.db';

  factory DatabaseProvider() => _instance;
  DatabaseProvider._internal();

  Future<Database> get database async {
    if (_database != null) return _database!;
    if (_initializationFuture != null) return _initializationFuture!;

    _initializationFuture = _initDatabase();
    _database = await _initializationFuture!;
    _initializationFuture = null;
    return _database!;
  }

  bool get isDatabaseOpen => _database != null && _database!.isOpen;

  Future<Database> _initDatabase() async {
    final databasesPath = await getDatabasesPath();
    final path = join(databasesPath, _databaseName);

    return await openDatabase(
      path,
      version: 1,
      onCreate: _onCreate,
      onUpgrade: _onUpgrade,
      onConfigure: _onConfigure,
    );
  }

  Future<void> _onConfigure(Database db) async {
    await db.execute('PRAGMA foreign_keys = ON');
    await db.rawQuery('PRAGMA journal_mode = WAL');
    await db.rawQuery('PRAGMA synchronous = NORMAL');
    await db.rawQuery('PRAGMA temp_store = MEMORY');
  }

  Future<void> _onCreate(Database db, int version) async {
    // Migrations serao adicionadas conforme features forem criadas
  }

  Future<void> _onUpgrade(Database db, int oldVersion, int newVersion) async {
    // Migrations incrementais serao adicionadas aqui
  }

  Future<void> clearAll() async {
    final db = await database;
    final tables = await db.rawQuery(
      "SELECT name FROM sqlite_master WHERE type='table' "
      "AND name NOT LIKE 'sqlite_%' AND name NOT LIKE 'android_%'",
    );
    for (final table in tables) {
      await db.delete(table['name'] as String);
    }
  }

  Future<void> closeDatabase() async {
    if (_database != null) {
      await _database!.close();
      _database = null;
    }
  }
}
