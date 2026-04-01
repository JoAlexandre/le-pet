import '../models/user_model.dart';

abstract class AuthLocalDatasource {
  Future<void> saveAccessToken(String token);
  Future<void> saveRefreshToken(String token);
  Future<void> saveUserData(UserModel user);
  Future<void> saveOnboardingStatus(bool isComplete);
  String? getAccessToken();
  String? getRefreshToken();
  UserModel? getUserData();
  bool getOnboardingStatus();
  Future<void> clearAuthData();
}
