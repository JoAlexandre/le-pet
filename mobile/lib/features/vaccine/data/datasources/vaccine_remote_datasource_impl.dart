import 'package:dio/dio.dart';
import '../../../../core/infrastructure/errors/exceptions.dart';
import '../../../../core/infrastructure/network/api_constants.dart';
import '../models/vaccine_record_model.dart';
import 'vaccine_remote_datasource.dart';

class VaccineRemoteDatasourceImpl implements VaccineRemoteDatasource {
  final Dio _dio;

  const VaccineRemoteDatasourceImpl({required Dio dio}) : _dio = dio;

  @override
  Future<List<VaccineRecordModel>> getVaccinesByAnimal(String animalId) async {
    try {
      final response = await _dio.get(
        '${ApiConstants.vaccines}/animals/$animalId',
      );
      final data = response.data;
      if (data is List) {
        return data
            .map(
              (item) =>
                  VaccineRecordModel.fromJson(item as Map<String, dynamic>),
            )
            .toList();
      }
      if (data is Map && data['data'] is List) {
        return (data['data'] as List)
            .map(
              (item) =>
                  VaccineRecordModel.fromJson(item as Map<String, dynamic>),
            )
            .toList();
      }
      return [];
    } on DioException catch (e) {
      _handleDioError(e);
    }
  }

  @override
  Future<VaccineRecordModel> getVaccineById(String id) async {
    try {
      final response = await _dio.get('${ApiConstants.vaccines}/$id');
      return VaccineRecordModel.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      _handleDioError(e);
    }
  }

  @override
  Future<VaccineRecordModel> createVaccine(VaccineRecordModel record) async {
    try {
      final response = await _dio.post(
        ApiConstants.vaccines,
        data: record.toCreateJson(),
      );
      return VaccineRecordModel.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      _handleDioError(e);
    }
  }

  @override
  Future<VaccineRecordModel> updateVaccine(VaccineRecordModel record) async {
    try {
      final response = await _dio.put(
        '${ApiConstants.vaccines}/${record.id}',
        data: record.toCreateJson(),
      );
      return VaccineRecordModel.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      _handleDioError(e);
    }
  }

  @override
  Future<void> deleteVaccine(String id) async {
    try {
      await _dio.delete('${ApiConstants.vaccines}/$id');
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
