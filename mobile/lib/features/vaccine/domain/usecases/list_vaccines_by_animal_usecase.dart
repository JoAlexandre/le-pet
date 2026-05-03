import 'package:dartz/dartz.dart';
import '../../../../core/domain/failures/failure.dart';
import '../entities/vaccine_record.dart';
import '../repositories/vaccine_repository.dart';

class ListVaccinesByAnimalUseCase {
  final VaccineRepository _repository;

  const ListVaccinesByAnimalUseCase(this._repository);

  Future<Either<Failure, List<VaccineRecord>>> call(String animalId) {
    return _repository.listByAnimal(animalId);
  }
}
