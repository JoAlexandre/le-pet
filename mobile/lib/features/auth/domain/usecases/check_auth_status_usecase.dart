import 'package:dartz/dartz.dart';
import '../../../../core/domain/failures/failure.dart';
import '../entities/user.dart';
import '../repositories/auth_repository.dart';

class CheckAuthStatusUseCase {
  final AuthRepository _repository;
  const CheckAuthStatusUseCase(this._repository);

  Future<Either<Failure, User?>> call() async {
    final isLoggedIn = await _repository.isLoggedIn();
    if (!isLoggedIn) return const Right(null);
    final result = await _repository.getCurrentUser();
    return result;
  }
}
