export interface CreateProfessionalDto {
  name: string;
  email: string;
  password: string;
  phone?: string;
  specialtyType: string;
  crmvNumber?: string;
  crmvState?: string;
}
