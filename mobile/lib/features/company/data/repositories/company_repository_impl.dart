import 'package:dartz/dartz.dart';
import '../../../../core/domain/failures/failure.dart';
import '../../../../core/infrastructure/errors/exceptions.dart';
import '../../../../core/infrastructure/network/network_info.dart';
import '../../domain/entities/company.dart';
import '../../domain/repositories/company_repository.dart';
import '../datasources/company_local_datasource.dart';
import '../datasources/company_remote_datasource.dart';
import '../models/company_model.dart';

class CompanyRepositoryImpl implements CompanyRepository {
  final CompanyRemoteDatasource _remoteDatasource;
  final CompanyLocalDatasource _localDatasource;
  final NetworkInfo _networkInfo;

  const CompanyRepositoryImpl({
    required CompanyRemoteDatasource remoteDatasource,
    required CompanyLocalDatasource localDatasource,
    required NetworkInfo networkInfo,
  }) : _remoteDatasource = remoteDatasource,
       _localDatasource = localDatasource,
       _networkInfo = networkInfo;

  @override
  Future<Either<Failure, List<Company>>> listCompanies() async {
    try {
      final cached = await _localDatasource.getCachedCompanies();
      if (cached.isNotEmpty) {
        _refreshCompaniesCache();
        return Right(cached);
      }
    } on CacheException {
      // Ignora e tenta rede
    }

    if (!await _networkInfo.isConnected) {
      return const Left(NetworkFailure());
    }
    return _fetchAndCacheCompanies();
  }

  Future<void> _refreshCompaniesCache() async {
    if (!await _networkInfo.isConnected) return;
    try {
      final models = await _remoteDatasource.getCompanies();
      await _localDatasource.cacheCompanies(models);
    } catch (_) {
      // Silencia erros de refresh em background
    }
  }

  Future<Either<Failure, List<Company>>> _fetchAndCacheCompanies() async {
    try {
      final models = await _remoteDatasource.getCompanies();
      await _localDatasource.cacheCompanies(models);
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
  Future<Either<Failure, Company>> getById(String id) async {
    if (!await _networkInfo.isConnected) {
      return const Left(NetworkFailure());
    }
    try {
      final model = await _remoteDatasource.getCompanyById(id);
      await _localDatasource.cacheCompany(model);
      return Right(model);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (_) {
      return const Left(UnexpectedFailure());
    }
  }

  @override
  Future<Either<Failure, Company>> create(Company company) async {
    if (!await _networkInfo.isConnected) {
      return const Left(NetworkFailure());
    }
    try {
      final model = CompanyModel(
        id: company.id,
        userId: company.userId,
        tradeName: company.tradeName,
        legalName: company.legalName,
        cnpj: company.cnpj,
        phone: company.phone,
        address: company.address,
        city: company.city,
        state: company.state,
        description: company.description,
        logoUrl: company.logoUrl,
        isActive: company.isActive,
        createdAt: company.createdAt,
      );
      final created = await _remoteDatasource.createCompany(
        model.toUpdateJson(),
      );
      await _localDatasource.cacheCompany(created);
      return Right(created);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (_) {
      return const Left(UnexpectedFailure());
    }
  }

  @override
  Future<Either<Failure, Company>> update(Company company) async {
    if (!await _networkInfo.isConnected) {
      return const Left(NetworkFailure());
    }
    try {
      final model = CompanyModel(
        id: company.id,
        userId: company.userId,
        tradeName: company.tradeName,
        legalName: company.legalName,
        cnpj: company.cnpj,
        phone: company.phone,
        address: company.address,
        city: company.city,
        state: company.state,
        description: company.description,
        logoUrl: company.logoUrl,
        isActive: company.isActive,
        createdAt: company.createdAt,
      );
      final updated = await _remoteDatasource.updateCompany(
        company.id,
        model.toUpdateJson(),
      );
      await _localDatasource.cacheCompany(updated);
      return Right(updated);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (_) {
      return const Left(UnexpectedFailure());
    }
  }
}
