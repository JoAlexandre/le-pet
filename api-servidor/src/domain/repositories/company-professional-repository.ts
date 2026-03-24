import { CompanyProfessional } from '../entities/company-professional';

export interface CompanyProfessionalRepository {
  findByCompanyAndUser(companyId: string, userId: string): Promise<CompanyProfessional | null>;
  findByUserId(userId: string): Promise<CompanyProfessional[]>;
  findByCompanyId(companyId: string): Promise<CompanyProfessional[]>;
  create(association: CompanyProfessional): Promise<CompanyProfessional>;
  delete(companyId: string, userId: string): Promise<void>;
}
