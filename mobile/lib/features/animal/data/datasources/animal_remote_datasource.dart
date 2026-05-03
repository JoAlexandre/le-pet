import '../models/animal_model.dart';

abstract class AnimalRemoteDatasource {
  Future<List<AnimalModel>> getAnimals();
  Future<AnimalModel> getAnimalById(String id);
  Future<AnimalModel> createAnimal(AnimalModel animal);
  Future<AnimalModel> updateAnimal(AnimalModel animal);
  Future<void> deleteAnimal(String id);
  Future<AnimalModel> uploadPhoto(String id, String filePath);
}
