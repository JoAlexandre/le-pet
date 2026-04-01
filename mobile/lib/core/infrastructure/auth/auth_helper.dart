import 'package:shared_preferences/shared_preferences.dart';
import '../http/auth_interceptor.dart';

class AuthHelper {
  final SharedPreferences sharedPreferences;

  AuthHelper({required this.sharedPreferences});

  Future<void> saveToken(String token) async {
    await AuthInterceptor.saveToken(sharedPreferences, token);
  }

  Future<void> clearToken() async {
    await AuthInterceptor.clearToken(sharedPreferences);
  }

  String? getToken() {
    return AuthInterceptor.getToken(sharedPreferences);
  }

  bool get isAuthenticated {
    final token = getToken();
    return token != null && token.isNotEmpty;
  }
}
