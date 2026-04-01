import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/navigation_service.dart';
import '../../presentation/routes/app_routes.dart';

class AuthInterceptor extends Interceptor {
  final SharedPreferences sharedPreferences;
  final NavigationService navigationService;
  static const String tokenKey = 'AUTH_TOKEN';

  AuthInterceptor({
    required this.sharedPreferences,
    required this.navigationService,
  });

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    final token = sharedPreferences.getString(tokenKey);
    if (token != null && token.isNotEmpty) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    super.onRequest(options, handler);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    if (err.response?.statusCode == 401) {
      _handleUnauthorized();
    }
    super.onError(err, handler);
  }

  Future<void> _handleUnauthorized() async {
    navigationService.showLoadingDialog('Sua sessao expirou.');
    await Future.delayed(const Duration(seconds: 2));
    navigationService.closeLoadingDialog();
    await clearToken(sharedPreferences);
    navigationService.navigateAndRemoveUntil(AppRoutes.login);
  }

  static Future<void> saveToken(SharedPreferences prefs, String token) async {
    await prefs.setString(tokenKey, token);
  }

  static Future<void> clearToken(SharedPreferences prefs) async {
    await prefs.remove(tokenKey);
  }

  static String? getToken(SharedPreferences prefs) {
    return prefs.getString(tokenKey);
  }
}
