import 'package:dartz/dartz.dart';
import '../../../../core/domain/failures/failure.dart';
import '../../../../core/infrastructure/errors/exceptions.dart';
import '../../../../core/infrastructure/network/network_info.dart';
import '../../domain/entities/animal.dart';
import '../../domain/repositories/animal_repository.dart';
import '../datasources/animal_local_datasource.dart';
import '../datasources/animal_remote_datasource.dart';
import '../models/animal_model.dart';

class AnimalRepositoryImpl implements AnimalRepository {
  final AnimalRemoteDatasource _remoteDatasource;
  final AnimalLocalDatasource _localDatasource;
  final NetworkInfo _networkInfo;

  const AnimalRepositoryImpl({
    required AnimalRemoteDatasource remoteDatasource,
    required AnimalLocalDatasource localDatasource,
    required NetworkInfo networkInfo,
  }) : _remoteDatasource = remoteDatasource,
       _localDatasource = localDatasource,
       _networkInfo = networkInfo;

  @override
  Future<Either<Failure, List<Animal>>> getAnimals() async {
    // Retorna cache imediatamente
    try {
      final cached = await _localDatasource.getCachedAnimals();
      if (cached.isNotEmpty) {
        // Busca em background para atualizar cache
        _refreshAnimalsCache();
        return Right(cached);
      }
    } on CacheException {
      // Ignora erro de cache e tenta rede
    }

    // Se cache vazio, busca na rede
    if (!await _networkInfo.isConnected) {
      return const Left(NetworkFailure());
    }
    return _fetchAndCacheAnimals();
  }

  Future<void> _refreshAnimalsCache() async {
    if (!await _networkInfo.isConnected) return;
    try {
      final models = await _remoteDatasource.getAnimals();
      await _localDatasource.cacheAnimals(models);
    } catch (_) {
      // Silencia erros de refresh em background
    }
  }

  Future<Either<Failure, List<Animal>>> _fetchAndCacheAnimals() async {
    try {
      final models = await _remoteDatasource.getAnimals();
      await _localDatasource.cacheAnimals(models);
      return Right(models);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } on NetworkException {
      return const Left(NetworkFailure());
    } catch (e) {
      return const Left(UnexpectedFailure());
    }
  }

  @override
  Future<Either<Failure, Animal>> getAnimalById(String id) async {
    // Retorna cache primeiro
    try {
      final cached = await _localDatasource.getCachedAnimal(id);
      if (cached != null) return Right(cached);
    } on CacheException {
      // Ignora e busca na rede
    }

    if (!await _networkInfo.isConnected) {
      return const Left(NetworkFailure());
    }
    try {
      final model = await _remoteDatasource.getAnimalById(id);
      await _localDatasource.cacheAnimal(model);
      return Right(model);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } on NetworkException {
      return const Left(NetworkFailure());
    } catch (e) {
      return const Left(UnexpectedFailure());
    }
  }

  @override
  Future<Either<Failure, Animal>> createAnimal(Animal animal) async {
    if (!await _networkInfo.isConnected) {
      return const Left(NetworkFailure());
    }
    try {
      final model = await _remoteDatasource.createAnimal(
        AnimalModel.fromEntity(animal),
      );
      await _localDatasource.cacheAnimal(model);
      return Right(model);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } on NetworkException {
      return const Left(NetworkFailure());
    } catch (e) {
      return const Left(UnexpectedFailure());
    }
  }

  @override
  Future<Either<Failure, Animal>> updateAnimal(Animal animal) async {
    if (!await _networkInfo.isConnected) {
      return const Left(NetworkFailure());
    }
    try {
      final model = await _remoteDatasource.updateAnimal(
        AnimalModel.fromEntity(animal),
      );
      await _localDatasource.cacheAnimal(model);
      return Right(model);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } on NetworkException {
      return const Left(NetworkFailure());
    } catch (e) {
      return const Left(UnexpectedFailure());
    }
  }

  @override
  Future<Either<Failure, void>> deleteAnimal(String id) async {
    if (!await _networkInfo.isConnected) {
      return const Left(NetworkFailure());
    }
    try {
      await _remoteDatasource.deleteAnimal(id);
      await _localDatasource.removeAnimal(id);
      return const Right(null);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } on NetworkException {
      return const Left(NetworkFailure());
    } catch (e) {
      return const Left(UnexpectedFailure());
    }
  }

  @override
  Future<Either<Failure, Animal>> uploadPhoto(
    String id,
    String filePath,
  ) async {
    if (!await _networkInfo.isConnected) {
      return const Left(NetworkFailure());
    }
    try {
      final model = await _remoteDatasource.uploadPhoto(id, filePath);
      await _localDatasource.cacheAnimal(model);
      return Right(model);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } on NetworkException {
      return const Left(NetworkFailure());
    } catch (e) {
      return const Left(UnexpectedFailure());
    }
  }
}
