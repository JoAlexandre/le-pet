import 'package:dartz/dartz.dart';
import '../../../../core/domain/failures/failure.dart';
import '../entities/vaccine_record.dart';
import '../repositories/vaccine_repository.dart';

class GetVaccineUseCase {
  final VaccineRepository _repository;

  const GetVaccineUseCase(this._repository);

  Future<Either<Failure, VaccineRecord>> call(String id) {
    return _repository.getById(id);
  }
}
