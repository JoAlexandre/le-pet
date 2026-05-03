import 'package:dio/dio.dart';
import '../../../../core/infrastructure/errors/exceptions.dart';
import '../../../../core/infrastructure/network/api_constants.dart';
import '../../../auth/data/models/user_model.dart';
import 'profile_remote_datasource.dart';

class ProfileRemoteDatasourceImpl implements ProfileRemoteDatasource {
  final Dio _dio;

  const ProfileRemoteDatasourceImpl({required Dio dio}) : _dio = dio;

  @override
  Future<UserModel> updateUser({
    required String userId,
    String? name,
    String? phone,
  }) async {
    try {
      final data = <String, dynamic>{};
      if (name != null) data['name'] = name;
      if (phone != null) data['phone'] = phone;
      print(data);

      final response = await _dio.put(
        '${ApiConstants.users}/$userId',
        data: data,
      );
      print(response.data);
      return UserModel.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      final statusCode = e.response?.statusCode;
      final message = e.response?.data?['message'] as String?;

      if (statusCode == 401) {
        throw ServerException(
          message ?? 'Sessao expirada. Faca login novamente.',
        );
      }
      if (statusCode == 422 || statusCode == 400) {
        throw ServerException(message ?? 'Dados invalidos.');
      }
      throw ServerException(message ?? 'Erro ao atualizar perfil.');
    }
  }

  @override
  Future<void> changePassword({required String newPassword}) async {
    try {
      await _dio.patch(
        '/auth/change-password',
        data: {'newPassword': newPassword},
      );
    } on DioException catch (e) {
      final message = e.response?.data?['message'] as String?;
      throw ServerException(message ?? 'Erro ao alterar senha.');
    }
  }
}
