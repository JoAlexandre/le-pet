export interface CreateCompanyDto {
  tradeName: string;
  legalName: string;
  cnpj: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  description?: string;
  logoUrl?: string;
}
