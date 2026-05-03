import 'package:flutter/foundation.dart';
import '../../domain/entities/vaccine_record.dart';
import '../../domain/usecases/list_vaccines_by_animal_usecase.dart';
import '../../domain/usecases/get_vaccine_usecase.dart';
import '../../domain/usecases/register_vaccine_usecase.dart';
import '../../domain/usecases/update_vaccine_usecase.dart';
import '../../domain/usecases/delete_vaccine_usecase.dart';

class VaccineProvider extends ChangeNotifier {
  final ListVaccinesByAnimalUseCase _listVaccinesByAnimalUseCase;
  final GetVaccineUseCase _getVaccineUseCase;
  final RegisterVaccineUseCase _registerVaccineUseCase;
  final UpdateVaccineUseCase _updateVaccineUseCase;
  final DeleteVaccineUseCase _deleteVaccineUseCase;

  VaccineProvider({
    required ListVaccinesByAnimalUseCase listVaccinesByAnimalUseCase,
    required GetVaccineUseCase getVaccineUseCase,
    required RegisterVaccineUseCase registerVaccineUseCase,
    required UpdateVaccineUseCase updateVaccineUseCase,
    required DeleteVaccineUseCase deleteVaccineUseCase,
  }) : _listVaccinesByAnimalUseCase = listVaccinesByAnimalUseCase,
       _getVaccineUseCase = getVaccineUseCase,
       _registerVaccineUseCase = registerVaccineUseCase,
       _updateVaccineUseCase = updateVaccineUseCase,
       _deleteVaccineUseCase = deleteVaccineUseCase;

  List<VaccineRecord> _vaccines = [];
  VaccineRecord? _selectedVaccine;
  bool _isLoading = false;
  bool _isActionLoading = false;
  String? _errorMessage;

  List<VaccineRecord> get vaccines => List.unmodifiable(_vaccines);
  VaccineRecord? get selectedVaccine => _selectedVaccine;
  bool get isLoading => _isLoading;
  bool get isActionLoading => _isActionLoading;
  String? get errorMessage => _errorMessage;

  List<VaccineRecord> get upcomingVaccines =>
      _vaccines.where((v) => v.nextDoseDate != null && v.isUpToDate).toList()
        ..sort((a, b) => a.nextDoseDate!.compareTo(b.nextDoseDate!));

  List<VaccineRecord> get dueSoonVaccines =>
      _vaccines.where((v) => v.isDueSoon).toList();

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

  Future<void> loadVaccinesByAnimal(String animalId) async {
    _setLoading(true);
    _errorMessage = null;
    final result = await _listVaccinesByAnimalUseCase(animalId);
    result.fold((failure) => _errorMessage = failure.message, (vaccines) {
      _vaccines = vaccines;
      _vaccines.sort((a, b) => b.applicationDate.compareTo(a.applicationDate));
    });
    _setLoading(false);
  }

  Future<void> loadVaccine(String id) async {
    _setLoading(true);
    _errorMessage = null;
    final result = await _getVaccineUseCase(id);
    result.fold(
      (failure) => _errorMessage = failure.message,
      (vaccine) => _selectedVaccine = vaccine,
    );
    _setLoading(false);
  }

  Future<bool> registerVaccine(VaccineRecord record) async {
    _setActionLoading(true);
    _errorMessage = null;
    final result = await _registerVaccineUseCase(record);
    bool success = false;
    result.fold((failure) => _errorMessage = failure.message, (created) {
      _vaccines.insert(0, created);
      _vaccines.sort((a, b) => b.applicationDate.compareTo(a.applicationDate));
      success = true;
    });
    _setActionLoading(false);
    return success;
  }

  Future<bool> updateVaccine(VaccineRecord record) async {
    _setActionLoading(true);
    _errorMessage = null;
    final result = await _updateVaccineUseCase(record);
    bool success = false;
    result.fold((failure) => _errorMessage = failure.message, (updated) {
      final idx = _vaccines.indexWhere((v) => v.id == updated.id);
      if (idx >= 0) _vaccines[idx] = updated;
      if (_selectedVaccine?.id == updated.id) _selectedVaccine = updated;
      _vaccines.sort((a, b) => b.applicationDate.compareTo(a.applicationDate));
      success = true;
    });
    _setActionLoading(false);
    return success;
  }

  Future<bool> deleteVaccine(String id) async {
    _setActionLoading(true);
    _errorMessage = null;
    final result = await _deleteVaccineUseCase(id);
    bool success = false;
    result.fold((failure) => _errorMessage = failure.message, (_) {
      _vaccines.removeWhere((v) => v.id == id);
      if (_selectedVaccine?.id == id) _selectedVaccine = null;
      success = true;
    });
    _setActionLoading(false);
    return success;
  }

  void clearVaccines() {
    _vaccines = [];
    _selectedVaccine = null;
    _errorMessage = null;
    notifyListeners();
  }
}
