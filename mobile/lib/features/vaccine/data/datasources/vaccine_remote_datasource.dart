import '../models/vaccine_record_model.dart';

abstract class VaccineRemoteDatasource {
  Future<List<VaccineRecordModel>> getVaccinesByAnimal(String animalId);
  Future<VaccineRecordModel> getVaccineById(String id);
  Future<VaccineRecordModel> createVaccine(VaccineRecordModel record);
  Future<VaccineRecordModel> updateVaccine(VaccineRecordModel record);
  Future<void> deleteVaccine(String id);
}
