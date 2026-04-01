import 'package:dio/dio.dart';
import '../network/api_config.dart';
import 'auth_interceptor.dart';

class DioClient {
  DioClient._();

  /// Cria Dio autenticado (com token)
  static Dio createDio({
    AuthInterceptor? authInterceptor,
    List<Interceptor>? additionalInterceptors,
  }) {
    final dio = Dio(
      BaseOptions(
        baseUrl: ApiConfig.apiUrl,
        connectTimeout: const Duration(seconds: ApiConfig.connectTimeout),
        receiveTimeout: const Duration(seconds: ApiConfig.receiveTimeout),
        sendTimeout: const Duration(seconds: ApiConfig.sendTimeout),
        headers: ApiConfig.defaultHeaders,
        responseType: ResponseType.json,
        validateStatus: (status) =>
            status != null && status >= 200 && status < 300,
      ),
    );

    if (authInterceptor != null) {
      dio.interceptors.add(authInterceptor);
    }
    if (additionalInterceptors != null) {
      dio.interceptors.addAll(additionalInterceptors);
    }
    return dio;
  }

  /// Cria Dio publico (sem autenticacao - login, registro)
  static Dio createPublicDio() {
    return Dio(
      BaseOptions(
        baseUrl: ApiConfig.apiUrl,
        connectTimeout: const Duration(seconds: ApiConfig.connectTimeout),
        receiveTimeout: const Duration(seconds: ApiConfig.receiveTimeout),
        sendTimeout: const Duration(seconds: ApiConfig.sendTimeout),
        headers: ApiConfig.defaultHeaders,
        responseType: ResponseType.json,
      ),
    );
  }
}
