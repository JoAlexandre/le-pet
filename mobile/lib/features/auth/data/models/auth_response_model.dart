import 'auth_tokens_model.dart';
import 'user_model.dart';

class AuthResponseModel {
  final UserModel user;
  final AuthTokensModel tokens;
  final bool isOnboardingComplete;

  const AuthResponseModel({
    required this.user,
    required this.tokens,
    required this.isOnboardingComplete,
  });

  factory AuthResponseModel.fromJson(Map<String, dynamic> json) {
    return AuthResponseModel(
      user: UserModel.fromJson(json['user'] as Map<String, dynamic>),
      tokens: AuthTokensModel.fromJson(json),
      isOnboardingComplete: json['isOnboardingComplete'] as bool? ?? false,
    );
  }
}
