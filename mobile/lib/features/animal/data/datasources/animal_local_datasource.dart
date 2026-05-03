import '../models/animal_model.dart';

abstract class AnimalLocalDatasource {
  Future<List<AnimalModel>> getCachedAnimals();
  Future<void> cacheAnimals(List<AnimalModel> animals);
  Future<AnimalModel?> getCachedAnimal(String id);
  Future<void> cacheAnimal(AnimalModel animal);
  Future<void> removeAnimal(String id);
  Future<void> clearAll();
}
