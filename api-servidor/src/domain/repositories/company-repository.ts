import { Company } from '../entities/company';

export interface CompanyRepository {
  findById(id: string): Promise<Company | null>;
  findByCNPJ(cnpj: string): Promise<Company | null>;
  findByUserId(userId: string): Promise<Company | null>;
  findAll(page: number, limit: number): Promise<{ rows: Company[]; count: number }>;
  create(company: Company): Promise<Company>;
  update(company: Company): Promise<Company>;
  softDelete(id: string): Promise<void>;
}
