import 'package:dartz/dartz.dart';
import '../../../../core/domain/failures/failure.dart';
import '../entities/user.dart';
import '../repositories/auth_repository.dart';

class GoogleAuthUseCase {
  final AuthRepository _repository;
  const GoogleAuthUseCase(this._repository);

  Future<Either<Failure, User>> call() {
    return _repository.loginWithGoogle();
  }
}
