import 'package:dartz/dartz.dart';
import '../../../../core/domain/failures/failure.dart';
import '../entities/company.dart';
import '../repositories/company_repository.dart';

class UpdateCompanyUseCase {
  final CompanyRepository _repository;

  const UpdateCompanyUseCase(this._repository);

  Future<Either<Failure, Company>> call(Company company) =>
      _repository.update(company);
}
