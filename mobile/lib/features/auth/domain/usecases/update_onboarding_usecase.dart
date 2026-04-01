import 'package:dartz/dartz.dart';
import '../../../../core/domain/failures/failure.dart';
import '../entities/user.dart';
import '../repositories/auth_repository.dart';

class UpdateOnboardingUseCase {
  final AuthRepository _repository;
  const UpdateOnboardingUseCase(this._repository);

  Future<Either<Failure, User>> call({
    required String role,
    String? specialtyType,
    String? crmvNumber,
    String? crmvState,
    String? phone,
  }) {
    return _repository.updateOnboarding(
      role: role,
      specialtyType: specialtyType,
      crmvNumber: crmvNumber,
      crmvState: crmvState,
      phone: phone,
    );
  }
}
