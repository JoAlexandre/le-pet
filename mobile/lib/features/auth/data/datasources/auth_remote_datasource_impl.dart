import 'package:dio/dio.dart';
import '../../../../core/infrastructure/errors/exceptions.dart';
import '../../../../core/infrastructure/network/api_constants.dart';
import '../models/auth_response_model.dart';
import '../models/user_model.dart';
import 'auth_remote_datasource.dart';

class AuthRemoteDatasourceImpl implements AuthRemoteDatasource {
  final Dio _dio;
  final Dio _publicDio;

  const AuthRemoteDatasourceImpl({required Dio dio, required Dio publicDio})
    : _dio = dio,
      _publicDio = publicDio;

  @override
  Future<AuthResponseModel> login(String email, String password) async {
    try {
      final response = await _publicDio.post(
        ApiConstants.authLogin,
        data: {'email': email, 'password': password},
      );
      return AuthResponseModel.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  @override
  Future<AuthResponseModel> loginWithGoogle(String idToken) async {
    try {
      final response = await _publicDio.post(
        ApiConstants.authGoogle,
        data: {'idToken': idToken},
      );
      return AuthResponseModel.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  @override
  Future<AuthResponseModel> loginWithApple({
    required String idToken,
    String? firstName,
    String? lastName,
  }) async {
    try {
      final data = <String, dynamic>{'idToken': idToken};
      if (firstName != null) data['firstName'] = firstName;
      if (lastName != null) data['lastName'] = lastName;

      final response = await _publicDio.post(
        ApiConstants.authApple,
        data: data,
      );
      return AuthResponseModel.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  @override
  Future<AuthResponseModel> refreshToken(String refreshToken) async {
    try {
      final response = await _publicDio.post(
        ApiConstants.authRefreshToken,
        data: {'refreshToken': refreshToken},
      );
      return AuthResponseModel.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  @override
  Future<void> logout() async {
    try {
      await _dio.post(ApiConstants.authLogout);
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  @override
  Future<UserModel> getCurrentUser() async {
    try {
      final response = await _dio.get(ApiConstants.authMe);
      return UserModel.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  @override
  Future<AuthResponseModel> updateOnboarding({
    required String role,
    String? specialtyType,
    String? crmvNumber,
    String? crmvState,
    String? phone,
  }) async {
    try {
      final data = <String, dynamic>{'role': role};
      if (specialtyType != null) data['specialtyType'] = specialtyType;
      if (crmvNumber != null) data['crmvNumber'] = crmvNumber;
      if (crmvState != null) data['crmvState'] = crmvState;
      if (phone != null) data['phone'] = phone;

      final response = await _dio.post(ApiConstants.authOnboarding, data: data);
      return AuthResponseModel.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  Exception _handleDioError(DioException e) {
    switch (e.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        return TimeoutException();
      case DioExceptionType.connectionError:
        return NetworkException('Sem conexao com a internet.');
      default:
        final statusCode = e.response?.statusCode;
        final data = e.response?.data;
        final message = data is Map<String, dynamic>
            ? (data['message'] as String?) ?? 'Erro no servidor.'
            : 'Erro no servidor.';

        if (statusCode == 404) {
          return NotFoundException();
        }
        return ServerException(message);
    }
  }
}
