import 'package:dio/dio.dart';
import '../../../../core/infrastructure/errors/exceptions.dart';
import '../../../../core/infrastructure/network/api_constants.dart';
import '../models/animal_model.dart';
import 'animal_remote_datasource.dart';

class AnimalRemoteDatasourceImpl implements AnimalRemoteDatasource {
  final Dio _dio;

  const AnimalRemoteDatasourceImpl({required Dio dio}) : _dio = dio;

  @override
  Future<List<AnimalModel>> getAnimals() async {
    try {
      final response = await _dio.get(ApiConstants.animals);
      final data = response.data;
      if (data is List) {
        return data
            .map((item) => AnimalModel.fromJson(item as Map<String, dynamic>))
            .toList();
      }
      if (data is Map && data['data'] is List) {
        return (data['data'] as List)
            .map((item) => AnimalModel.fromJson(item as Map<String, dynamic>))
            .toList();
      }
      return [];
    } on DioException catch (e) {
      _handleDioError(e);
    }
  }

  @override
  Future<AnimalModel> getAnimalById(String id) async {
    try {
      final response = await _dio.get('${ApiConstants.animals}/$id');
      return AnimalModel.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      _handleDioError(e);
    }
  }

  @override
  Future<AnimalModel> createAnimal(AnimalModel animal) async {
    try {
      final response = await _dio.post(
        ApiConstants.animals,
        data: animal.toCreateJson(),
      );
      return AnimalModel.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      _handleDioError(e);
    }
  }

  @override
  Future<AnimalModel> updateAnimal(AnimalModel animal) async {
    try {
      final response = await _dio.put(
        '${ApiConstants.animals}/${animal.id}',
        data: animal.toCreateJson(),
      );
      return AnimalModel.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      _handleDioError(e);
    }
  }

  @override
  Future<void> deleteAnimal(String id) async {
    try {
      await _dio.delete('${ApiConstants.animals}/$id');
    } on DioException catch (e) {
      _handleDioError(e);
    }
  }

  @override
  Future<AnimalModel> uploadPhoto(String id, String filePath) async {
    try {
      final formData = FormData.fromMap({
        'photo': await MultipartFile.fromFile(filePath),
      });
      final response = await _dio.post(
        '${ApiConstants.animals}/$id/photo',
        data: formData,
        options: Options(headers: {'Content-Type': 'multipart/form-data'}),
      );
      return AnimalModel.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      _handleDioError(e);
    }
  }

  Never _handleDioError(DioException e) {
    final statusCode = e.response?.statusCode;
    final message = e.response?.data?['message'] as String?;

    if (statusCode == 401) {
      throw ServerException(
        message ?? 'Sessao expirada. Faca login novamente.',
      );
    }
    if (statusCode == 404) {
      throw ServerException(message ?? 'Animal nao encontrado.');
    }
    if (statusCode == 422 || statusCode == 400) {
      throw ServerException(message ?? 'Dados invalidos.');
    }
    throw ServerException(message ?? 'Erro ao processar requisicao.');
  }
}
