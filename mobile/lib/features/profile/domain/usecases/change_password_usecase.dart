import 'package:dartz/dartz.dart';
import '../../../../core/domain/failures/failure.dart';
import '../repositories/profile_repository.dart';

class ChangePasswordUseCase {
  final ProfileRepository _repository;

  const ChangePasswordUseCase(this._repository);

  Future<Either<Failure, void>> call({required String newPassword}) {
    return _repository.changePassword(newPassword: newPassword);
  }
}
