import 'package:dartz/dartz.dart';
import '../../../../core/domain/failures/failure.dart';
import '../entities/animal.dart';

abstract class AnimalRepository {
  Future<Either<Failure, List<Animal>>> getAnimals();
  Future<Either<Failure, Animal>> getAnimalById(String id);
  Future<Either<Failure, Animal>> createAnimal(Animal animal);
  Future<Either<Failure, Animal>> updateAnimal(Animal animal);
  Future<Either<Failure, void>> deleteAnimal(String id);
  Future<Either<Failure, Animal>> uploadPhoto(String id, String filePath);
}
