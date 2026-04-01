import 'package:dartz/dartz.dart';
import '../../../../core/domain/failures/failure.dart';
import '../entities/user.dart';

abstract class AuthRepository {
  Future<Either<Failure, User>> login(String email, String password);
  Future<Either<Failure, User>> loginWithGoogle();
  Future<Either<Failure, User>> loginWithApple();
  Future<Either<Failure, void>> refreshToken();
  Future<Either<Failure, void>> logout();
  Future<Either<Failure, User>> getCurrentUser();
  Future<bool> isLoggedIn();
  Future<Either<Failure, User>> updateOnboarding({
    required String role,
    String? specialtyType,
    String? crmvNumber,
    String? crmvState,
    String? phone,
  });
}
