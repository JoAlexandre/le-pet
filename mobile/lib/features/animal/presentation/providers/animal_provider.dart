import 'package:flutter/foundation.dart';
import '../../domain/entities/animal.dart';
import '../../domain/usecases/list_animals_usecase.dart';
import '../../domain/usecases/get_animal_usecase.dart';
import '../../domain/usecases/create_animal_usecase.dart';
import '../../domain/usecases/update_animal_usecase.dart';
import '../../domain/usecases/delete_animal_usecase.dart';
import '../../domain/usecases/upload_animal_photo_usecase.dart';

class AnimalProvider extends ChangeNotifier {
  final ListAnimalsUseCase _listAnimalsUseCase;
  final GetAnimalUseCase _getAnimalUseCase;
  final CreateAnimalUseCase _createAnimalUseCase;
  final UpdateAnimalUseCase _updateAnimalUseCase;
  final DeleteAnimalUseCase _deleteAnimalUseCase;
  final UploadAnimalPhotoUseCase _uploadAnimalPhotoUseCase;

  AnimalProvider({
    required ListAnimalsUseCase listAnimalsUseCase,
    required GetAnimalUseCase getAnimalUseCase,
    required CreateAnimalUseCase createAnimalUseCase,
    required UpdateAnimalUseCase updateAnimalUseCase,
    required DeleteAnimalUseCase deleteAnimalUseCase,
    required UploadAnimalPhotoUseCase uploadAnimalPhotoUseCase,
  }) : _listAnimalsUseCase = listAnimalsUseCase,
       _getAnimalUseCase = getAnimalUseCase,
       _createAnimalUseCase = createAnimalUseCase,
       _updateAnimalUseCase = updateAnimalUseCase,
       _deleteAnimalUseCase = deleteAnimalUseCase,
       _uploadAnimalPhotoUseCase = uploadAnimalPhotoUseCase;

  List<Animal> _animals = [];
  Animal? _selectedAnimal;
  bool _isLoading = false;
  bool _isActionLoading = false;
  String? _errorMessage;

  List<Animal> get animals => List.unmodifiable(_animals);
  Animal? get selectedAnimal => _selectedAnimal;
  bool get isLoading => _isLoading;
  bool get isActionLoading => _isActionLoading;
  String? get errorMessage => _errorMessage;

  void _setLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }

  void _setActionLoading(bool value) {
    _isActionLoading = value;
    notifyListeners();
  }

  void resetStatus() {
    _errorMessage = null;
    notifyListeners();
  }

  Future<void> loadAnimals() async {
    _setLoading(true);
    _errorMessage = null;
    final result = await _listAnimalsUseCase();
    result.fold(
      (failure) => _errorMessage = failure.message,
      (animals) => _animals = animals,
    );
    _setLoading(false);
  }

  Future<void> loadAnimal(String id) async {
    _setLoading(true);
    _errorMessage = null;
    final result = await _getAnimalUseCase(id);
    result.fold(
      (failure) => _errorMessage = failure.message,
      (animal) => _selectedAnimal = animal,
    );
    _setLoading(false);
  }

  Future<bool> createAnimal(Animal animal) async {
    _setActionLoading(true);
    _errorMessage = null;
    bool success = false;
    final result = await _createAnimalUseCase(animal);
    result.fold((failure) => _errorMessage = failure.message, (created) {
      _animals = [created, ..._animals];
      success = true;
    });
    _setActionLoading(false);
    return success;
  }

  Future<bool> updateAnimal(Animal animal) async {
    _setActionLoading(true);
    _errorMessage = null;
    bool success = false;
    final result = await _updateAnimalUseCase(animal);
    result.fold((failure) => _errorMessage = failure.message, (updated) {
      final index = _animals.indexWhere((a) => a.id == updated.id);
      if (index != -1) {
        _animals = List.from(_animals)..[index] = updated;
      }
      if (_selectedAnimal?.id == updated.id) {
        _selectedAnimal = updated;
      }
      success = true;
    });
    _setActionLoading(false);
    return success;
  }

  Future<bool> deleteAnimal(String id) async {
    _setActionLoading(true);
    _errorMessage = null;
    bool success = false;
    final result = await _deleteAnimalUseCase(id);
    result.fold((failure) => _errorMessage = failure.message, (_) {
      _animals = _animals.where((a) => a.id != id).toList();
      if (_selectedAnimal?.id == id) {
        _selectedAnimal = null;
      }
      success = true;
    });
    _setActionLoading(false);
    return success;
  }

  Future<bool> uploadPhoto(String id, String filePath) async {
    _setActionLoading(true);
    _errorMessage = null;
    bool success = false;
    final result = await _uploadAnimalPhotoUseCase(id: id, filePath: filePath);
    result.fold((failure) => _errorMessage = failure.message, (updated) {
      final index = _animals.indexWhere((a) => a.id == updated.id);
      if (index != -1) {
        _animals = List.from(_animals)..[index] = updated;
      }
      if (_selectedAnimal?.id == updated.id) {
        _selectedAnimal = updated;
      }
      success = true;
    });
    _setActionLoading(false);
    return success;
  }
}
