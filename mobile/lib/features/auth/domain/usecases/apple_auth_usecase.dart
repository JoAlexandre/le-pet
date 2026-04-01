import 'package:dartz/dartz.dart';
import '../../../../core/domain/failures/failure.dart';
import '../entities/user.dart';
import '../repositories/auth_repository.dart';

class AppleAuthUseCase {
  final AuthRepository _repository;
  const AppleAuthUseCase(this._repository);

  Future<Either<Failure, User>> call() {
    return _repository.loginWithApple();
  }
}
