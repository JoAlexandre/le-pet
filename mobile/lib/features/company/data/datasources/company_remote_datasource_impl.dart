import 'package:dio/dio.dart';
import '../../../../core/infrastructure/errors/exceptions.dart';
import '../../../../core/infrastructure/network/api_constants.dart';
import '../models/company_model.dart';
import 'company_remote_datasource.dart';

class CompanyRemoteDatasourceImpl implements CompanyRemoteDatasource {
  final Dio _dio;

  const CompanyRemoteDatasourceImpl({required Dio dio}) : _dio = dio;

  @override
  Future<List<CompanyModel>> getCompanies() async {
    try {
      final response = await _dio.get(ApiConstants.clinics);
      final data = response.data;
      if (data is List) {
        return data
            .map((item) => CompanyModel.fromJson(item as Map<String, dynamic>))
            .toList();
      }
      if (data is Map && data['data'] is List) {
        return (data['data'] as List)
            .map((item) => CompanyModel.fromJson(item as Map<String, dynamic>))
            .toList();
      }
      return [];
    } on DioException catch (e) {
      _handleDioError(e);
    }
  }

  @override
  Future<CompanyModel> getCompanyById(String id) async {
    try {
      final response = await _dio.get('${ApiConstants.clinics}/$id');
      return CompanyModel.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      _handleDioError(e);
    }
  }

  @override
  Future<CompanyModel> updateCompany(
    String id,
    Map<String, dynamic> data,
  ) async {
    try {
      final response = await _dio.put(
        '${ApiConstants.clinics}/$id',
        data: data,
      );
      return CompanyModel.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      _handleDioError(e);
    }
  }

  @override
  Future<CompanyModel> createCompany(Map<String, dynamic> data) async {
    try {
      final response = await _dio.post(ApiConstants.clinics, data: data);
      return CompanyModel.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      _handleDioError(e);
    }
  }

  Never _handleDioError(DioException e) {
    if (e.type == DioExceptionType.connectionTimeout ||
        e.type == DioExceptionType.receiveTimeout ||
        e.type == DioExceptionType.connectionError) {
      throw NetworkException('Sem conexao com a internet');
    }
    final message = e.response?.data is Map
        ? (e.response!.data as Map)['message'] as String? ?? 'Erro no servidor'
        : 'Erro no servidor';
    throw ServerException(message);
  }
}
