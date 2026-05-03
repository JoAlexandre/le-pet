import 'package:dartz/dartz.dart';
import '../../../../core/domain/failures/failure.dart';
import '../../../auth/domain/entities/user.dart';
import '../repositories/profile_repository.dart';

class UpdateUserUseCase {
  final ProfileRepository _repository;

  const UpdateUserUseCase(this._repository);

  Future<Either<Failure, User>> call({
    required String userId,
    String? name,
    String? phone,
  }) {
    return _repository.updateUser(userId: userId, name: name, phone: phone);
  }
}
