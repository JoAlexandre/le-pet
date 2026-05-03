import 'package:flutter/foundation.dart';
import '../../domain/entities/company.dart';
import '../../domain/usecases/list_companies_usecase.dart';
import '../../domain/usecases/get_company_usecase.dart';
import '../../domain/usecases/create_company_usecase.dart';
import '../../domain/usecases/update_company_usecase.dart';

class CompanyProvider extends ChangeNotifier {
  final ListCompaniesUseCase _listCompaniesUseCase;
  final GetCompanyUseCase _getCompanyUseCase;
  final CreateCompanyUseCase _createCompanyUseCase;
  final UpdateCompanyUseCase _updateCompanyUseCase;

  CompanyProvider({
    required ListCompaniesUseCase listCompaniesUseCase,
    required GetCompanyUseCase getCompanyUseCase,
    required CreateCompanyUseCase createCompanyUseCase,
    required UpdateCompanyUseCase updateCompanyUseCase,
  }) : _listCompaniesUseCase = listCompaniesUseCase,
       _getCompanyUseCase = getCompanyUseCase,
       _createCompanyUseCase = createCompanyUseCase,
       _updateCompanyUseCase = updateCompanyUseCase;

  List<Company> _companies = [];
  List<Company> _filtered = [];
  Company? _selectedCompany;
  bool _isLoading = false;
  bool _isActionLoading = false;
  String? _errorMessage;
  String _searchQuery = '';

  List<Company> get companies => List.unmodifiable(_filtered);
  List<Company> get allCompanies => List.unmodifiable(_companies);
  Company? get selectedCompany => _selectedCompany;
  bool get isLoading => _isLoading;
  bool get isActionLoading => _isActionLoading;
  String? get errorMessage => _errorMessage;
  String get searchQuery => _searchQuery;

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

  void search(String query) {
    _searchQuery = query;
    _applyFilter();
    notifyListeners();
  }

  void _applyFilter() {
    if (_searchQuery.isEmpty) {
      _filtered = List.of(_companies);
    } else {
      final q = _searchQuery.toLowerCase();
      _filtered = _companies
          .where(
            (c) =>
                c.tradeName.toLowerCase().contains(q) ||
                c.city.toLowerCase().contains(q) ||
                c.state.toLowerCase().contains(q),
          )
          .toList();
    }
  }

  Future<void> loadCompanies() async {
    _setLoading(true);
    _errorMessage = null;
    final result = await _listCompaniesUseCase();
    result.fold((failure) => _errorMessage = failure.message, (companies) {
      _companies = companies;
      _applyFilter();
    });
    _setLoading(false);
  }

  Future<void> loadCompany(String id) async {
    _setLoading(true);
    _errorMessage = null;
    final result = await _getCompanyUseCase(id);
    result.fold(
      (failure) => _errorMessage = failure.message,
      (company) => _selectedCompany = company,
    );
    _setLoading(false);
  }

  Future<bool> createCompany(Company company) async {
    _setActionLoading(true);
    _errorMessage = null;
    bool success = false;
    final result = await _createCompanyUseCase(company);
    result.fold((failure) => _errorMessage = failure.message, (created) {
      _companies.add(created);
      _applyFilter();
      success = true;
    });
    _setActionLoading(false);
    return success;
  }

  Future<bool> updateCompany(Company company) async {
    _setActionLoading(true);
    _errorMessage = null;
    bool success = false;
    final result = await _updateCompanyUseCase(company);
    result.fold((failure) => _errorMessage = failure.message, (updated) {
      _selectedCompany = updated;
      final idx = _companies.indexWhere((c) => c.id == updated.id);
      if (idx >= 0) {
        _companies[idx] = updated;
        _applyFilter();
      }
      success = true;
    });
    _setActionLoading(false);
    return success;
  }
}
