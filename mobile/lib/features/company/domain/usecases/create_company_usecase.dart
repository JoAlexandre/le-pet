import 'package:dartz/dartz.dart';
import '../../../../core/domain/failures/failure.dart';
import '../entities/company.dart';
import '../repositories/company_repository.dart';

class CreateCompanyUseCase {
  final CompanyRepository _repository;

  const CreateCompanyUseCase(this._repository);

  Future<Either<Failure, Company>> call(Company company) =>
      _repository.create(company);
}
