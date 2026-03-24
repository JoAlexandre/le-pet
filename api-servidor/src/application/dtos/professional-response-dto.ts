export interface ProfessionalResponseDto {
  id: string;
  name: string;
  email: string;
  specialtyType: string | null;
  crmvNumber: string | null;
  crmvState: string | null;
  crmvStatus: string | null;
  phone: string | null;
  isOnboardingComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}
