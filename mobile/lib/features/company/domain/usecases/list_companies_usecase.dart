import 'package:dartz/dartz.dart';
import '../../../../core/domain/failures/failure.dart';
import '../entities/company.dart';
import '../repositories/company_repository.dart';

class ListCompaniesUseCase {
  final CompanyRepository _repository;

  const ListCompaniesUseCase(this._repository);

  Future<Either<Failure, List<Company>>> call() => _repository.listCompanies();
}
