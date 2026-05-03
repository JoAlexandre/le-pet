import 'package:dartz/dartz.dart';
import '../../../../core/domain/failures/failure.dart';
import '../repositories/vaccine_repository.dart';

class DeleteVaccineUseCase {
  final VaccineRepository _repository;

  const DeleteVaccineUseCase(this._repository);

  Future<Either<Failure, void>> call(String id) {
    return _repository.delete(id);
  }
}
