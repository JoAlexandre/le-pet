import 'package:dartz/dartz.dart';
import '../../../../core/domain/failures/failure.dart';
import '../entities/vaccine_record.dart';
import '../repositories/vaccine_repository.dart';

class UpdateVaccineUseCase {
  final VaccineRepository _repository;

  const UpdateVaccineUseCase(this._repository);

  Future<Either<Failure, VaccineRecord>> call(VaccineRecord record) {
    return _repository.update(record);
  }
}
