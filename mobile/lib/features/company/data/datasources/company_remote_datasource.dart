import '../models/company_model.dart';

abstract class CompanyRemoteDatasource {
  Future<List<CompanyModel>> getCompanies();
  Future<CompanyModel> getCompanyById(String id);
  Future<CompanyModel> createCompany(Map<String, dynamic> data);
  Future<CompanyModel> updateCompany(String id, Map<String, dynamic> data);
}
