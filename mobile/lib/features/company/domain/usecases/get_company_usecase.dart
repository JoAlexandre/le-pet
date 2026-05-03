import 'package:dartz/dartz.dart';
import '../../../../core/domain/failures/failure.dart';
import '../entities/company.dart';
import '../repositories/company_repository.dart';

class GetCompanyUseCase {
  final CompanyRepository _repository;

  const GetCompanyUseCase(this._repository);

  Future<Either<Failure, Company>> call(String id) => _repository.getById(id);
}
