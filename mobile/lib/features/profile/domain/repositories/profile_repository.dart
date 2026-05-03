import 'package:dartz/dartz.dart';
import '../../../../core/domain/failures/failure.dart';
import '../../../auth/domain/entities/user.dart';

abstract class ProfileRepository {
  Future<Either<Failure, User>> updateUser({
    required String userId,
    String? name,
    String? phone,
  });

  Future<Either<Failure, void>> changePassword({required String newPassword});
}
