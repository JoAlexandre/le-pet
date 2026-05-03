import 'package:dartz/dartz.dart';
import '../../../../core/domain/failures/failure.dart';
import '../entities/animal.dart';
import '../repositories/animal_repository.dart';

class ListAnimalsUseCase {
  final AnimalRepository _repository;

  const ListAnimalsUseCase(this._repository);

  Future<Either<Failure, List<Animal>>> call() {
    return _repository.getAnimals();
  }
}
