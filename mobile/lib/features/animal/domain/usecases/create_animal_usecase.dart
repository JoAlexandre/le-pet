import 'package:dartz/dartz.dart';
import '../../../../core/domain/failures/failure.dart';
import '../entities/animal.dart';
import '../repositories/animal_repository.dart';

class CreateAnimalUseCase {
  final AnimalRepository _repository;

  const CreateAnimalUseCase(this._repository);

  Future<Either<Failure, Animal>> call(Animal animal) {
    return _repository.createAnimal(animal);
  }
}
