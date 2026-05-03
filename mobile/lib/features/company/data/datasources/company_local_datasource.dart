import '../models/company_model.dart';

abstract class CompanyLocalDatasource {
  Future<List<CompanyModel>> getCachedCompanies();
  Future<void> cacheCompanies(List<CompanyModel> companies);
  Future<void> cacheCompany(CompanyModel company);
}
