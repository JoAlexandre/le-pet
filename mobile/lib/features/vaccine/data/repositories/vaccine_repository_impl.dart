import 'package:dartz/dartz.dart';
import '../../../../core/domain/failures/failure.dart';
import '../../../../core/infrastructure/errors/exceptions.dart';
import '../../../../core/infrastructure/network/network_info.dart';
import '../../domain/entities/vaccine_record.dart';
import '../../domain/repositories/vaccine_repository.dart';
import '../datasources/vaccine_local_datasource.dart';
import '../datasources/vaccine_remote_datasource.dart';
import '../models/vaccine_record_model.dart';

class VaccineRepositoryImpl implements VaccineRepository {
  final VaccineRemoteDatasource _remoteDatasource;
  final VaccineLocalDatasource _localDatasource;
  final NetworkInfo _networkInfo;

  const VaccineRepositoryImpl({
    required VaccineRemoteDatasource remoteDatasource,
    required VaccineLocalDatasource localDatasource,
    required NetworkInfo networkInfo,
  }) : _remoteDatasource = remoteDatasource,
       _localDatasource = localDatasource,
       _networkInfo = networkInfo;

  @override
  Future<Either<Failure, List<VaccineRecord>>> listByAnimal(
    String animalId,
  ) async {
    try {
      final cached = await _localDatasource.getCachedVaccinesByAnimal(animalId);
      if (cached.isNotEmpty) {
        _refreshVaccinesCache(animalId);
        return Right(cached);
      }
    } on CacheException {
      // Ignora e tenta rede
    }

    if (!await _networkInfo.isConnected) {
      return const Left(NetworkFailure());
    }
    return _fetchAndCacheVaccines(animalId);
  }

  Future<void> _refreshVaccinesCache(String animalId) async {
    if (!await _networkInfo.isConnected) return;
    try {
      final models = await _remoteDatasource.getVaccinesByAnimal(animalId);
      await _localDatasource.cacheVaccinesForAnimal(animalId, models);
    } catch (_) {
      // Silencia erros de refresh em background
    }
  }

  Future<Either<Failure, List<VaccineRecord>>> _fetchAndCacheVaccines(
    String animalId,
  ) async {
    try {
      final models = await _remoteDatasource.getVaccinesByAnimal(animalId);
      await _localDatasource.cacheVaccinesForAnimal(animalId, models);
      return Right(models);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } on NetworkException {
      return const Left(NetworkFailure());
    } catch (_) {
      return const Left(UnexpectedFailure());
    }
  }

  @override
  Future<Either<Failure, VaccineRecord>> getById(String id) async {
    if (!await _networkInfo.isConnected) {
      return const Left(NetworkFailure());
    }
    try {
      final model = await _remoteDatasource.getVaccineById(id);
      return Right(model);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (_) {
      return const Left(UnexpectedFailure());
    }
  }

  @override
  Future<Either<Failure, VaccineRecord>> register(VaccineRecord record) async {
    if (!await _networkInfo.isConnected) {
      return const Left(NetworkFailure());
    }
    try {
      final model = VaccineRecordModel(
        animalId: record.animalId,
        professionalId: record.professionalId,
        vaccineName: record.vaccineName,
        vaccineManufacturer: record.vaccineManufacturer,
        batchNumber: record.batchNumber,
        applicationDate: record.applicationDate,
        nextDoseDate: record.nextDoseDate,
        notes: record.notes,
      );
      final created = await _remoteDatasource.createVaccine(model);
      return Right(created);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (_) {
      return const Left(UnexpectedFailure());
    }
  }

  @override
  Future<Either<Failure, VaccineRecord>> update(VaccineRecord record) async {
    if (!await _networkInfo.isConnected) {
      return const Left(NetworkFailure());
    }
    try {
      final model = VaccineRecordModel(
        id: record.id,
        animalId: record.animalId,
        professionalId: record.professionalId,
        vaccineName: record.vaccineName,
        vaccineManufacturer: record.vaccineManufacturer,
        batchNumber: record.batchNumber,
        applicationDate: record.applicationDate,
        nextDoseDate: record.nextDoseDate,
        notes: record.notes,
        createdAt: record.createdAt,
      );
      final updated = await _remoteDatasource.updateVaccine(model);
      return Right(updated);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (_) {
      return const Left(UnexpectedFailure());
    }
  }

  @override
  Future<Either<Failure, void>> delete(String id) async {
    if (!await _networkInfo.isConnected) {
      return const Left(NetworkFailure());
    }
    try {
      await _remoteDatasource.deleteVaccine(id);
      await _localDatasource.removeVaccine(id);
      return const Right(null);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (_) {
      return const Left(UnexpectedFailure());
    }
  }
}
