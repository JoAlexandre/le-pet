export interface CompanyResponseDto {
  id: string;
  userId: string;
  tradeName: string;
  legalName: string;
  cnpj: string | null;
  phone: string;
  address: string;
  city: string;
  state: string;
  description: string | null;
  logoUrl: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
