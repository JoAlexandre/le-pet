import 'package:dartz/dartz.dart';
import '../../../../core/domain/failures/failure.dart';
import '../entities/company.dart';

abstract class CompanyRepository {
  Future<Either<Failure, List<Company>>> listCompanies();
  Future<Either<Failure, Company>> getById(String id);
  Future<Either<Failure, Company>> create(Company company);
  Future<Either<Failure, Company>> update(Company company);
}
