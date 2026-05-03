import 'package:dartz/dartz.dart';
import '../../../../core/domain/failures/failure.dart';
import '../entities/animal.dart';
import '../repositories/animal_repository.dart';

class UpdateAnimalUseCase {
  final AnimalRepository _repository;

  const UpdateAnimalUseCase(this._repository);

  Future<Either<Failure, Animal>> call(Animal animal) {
    return _repository.updateAnimal(animal);
  }
}
