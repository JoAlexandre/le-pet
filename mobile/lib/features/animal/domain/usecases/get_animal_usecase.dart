import 'package:dartz/dartz.dart';
import '../../../../core/domain/failures/failure.dart';
import '../entities/animal.dart';
import '../repositories/animal_repository.dart';

class GetAnimalUseCase {
  final AnimalRepository _repository;

  const GetAnimalUseCase(this._repository);

  Future<Either<Failure, Animal>> call(String id) {
    return _repository.getAnimalById(id);
  }
}
