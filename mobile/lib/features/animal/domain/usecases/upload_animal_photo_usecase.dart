import 'package:dartz/dartz.dart';
import '../../../../core/domain/failures/failure.dart';
import '../entities/animal.dart';
import '../repositories/animal_repository.dart';

class UploadAnimalPhotoUseCase {
  final AnimalRepository _repository;

  const UploadAnimalPhotoUseCase(this._repository);

  Future<Either<Failure, Animal>> call({
    required String id,
    required String filePath,
  }) {
    return _repository.uploadPhoto(id, filePath);
  }
}
