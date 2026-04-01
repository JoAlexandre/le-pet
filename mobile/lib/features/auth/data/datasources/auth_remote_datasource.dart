import '../models/auth_response_model.dart';
import '../models/user_model.dart';

abstract class AuthRemoteDatasource {
  Future<AuthResponseModel> login(String email, String password);
  Future<AuthResponseModel> loginWithGoogle(String idToken);
  Future<AuthResponseModel> loginWithApple({
    required String idToken,
    String? firstName,
    String? lastName,
  });
  Future<AuthResponseModel> refreshToken(String refreshToken);
  Future<void> logout();
  Future<UserModel> getCurrentUser();
  Future<AuthResponseModel> updateOnboarding({
    required String role,
    String? specialtyType,
    String? crmvNumber,
    String? crmvState,
    String? phone,
  });
}
