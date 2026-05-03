import '../models/vaccine_record_model.dart';

abstract class VaccineLocalDatasource {
  Future<List<VaccineRecordModel>> getCachedVaccinesByAnimal(String animalId);
  Future<void> cacheVaccinesForAnimal(
    String animalId,
    List<VaccineRecordModel> records,
  );
  Future<void> removeVaccine(String id);
}
