import 'package:dartz/dartz.dart';
import '../../../../core/domain/failures/failure.dart';
import '../repositories/animal_repository.dart';

class DeleteAnimalUseCase {
  final AnimalRepository _repository;

  const DeleteAnimalUseCase(this._repository);

  Future<Either<Failure, void>> call(String id) {
    return _repository.deleteAnimal(id);
  }
}
