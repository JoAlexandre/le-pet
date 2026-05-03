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
      version: 4,
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
    await _createAnimalsTable(db);
    await _createVaccineRecordsTable(db);
    await _createCompaniesTable(db);
  }

  Future<void> _onUpgrade(Database db, int oldVersion, int newVersion) async {
    if (oldVersion < 2) {
      await _createAnimalsTable(db);
    }
    if (oldVersion < 3) {
      await _createVaccineRecordsTable(db);
    }
    if (oldVersion < 4) {
      await _createCompaniesTable(db);
    }
  }

  Future<void> _createAnimalsTable(Database db) async {
    await db.execute('''
      CREATE TABLE IF NOT EXISTS animals (
        id TEXT PRIMARY KEY,
        tutorId TEXT NOT NULL,
        name TEXT NOT NULL,
        species TEXT NOT NULL,
        breed TEXT,
        gender TEXT NOT NULL,
        birthDate TEXT,
        weight REAL,
        color TEXT,
        microchipNumber TEXT,
        photoUrl TEXT,
        allergies TEXT,
        notes TEXT,
        isActive INTEGER NOT NULL DEFAULT 1,
        createdAt TEXT
      )
    ''');
  }

  Future<void> _createVaccineRecordsTable(Database db) async {
    await db.execute('''
      CREATE TABLE IF NOT EXISTS vaccine_records (
        id TEXT PRIMARY KEY,
        animalId TEXT NOT NULL,
        professionalId TEXT,
        vaccineName TEXT NOT NULL,
        vaccineManufacturer TEXT,
        batchNumber TEXT,
        applicationDate TEXT NOT NULL,
        nextDoseDate TEXT,
        notes TEXT,
        createdAt TEXT
      )
    ''');
  }

  Future<void> _createCompaniesTable(Database db) async {
    await db.execute('''
      CREATE TABLE IF NOT EXISTS companies (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        tradeName TEXT NOT NULL,
        legalName TEXT,
        cnpj TEXT,
        phone TEXT NOT NULL,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        description TEXT,
        logoUrl TEXT,
        isActive INTEGER NOT NULL DEFAULT 1,
        createdAt TEXT
      )
    ''');
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
