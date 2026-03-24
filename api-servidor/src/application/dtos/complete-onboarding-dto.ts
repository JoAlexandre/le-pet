import { Role } from '../../domain/enums/role';
import { SpecialtyType } from '../../domain/enums/specialty-type';

export interface CompleteOnboardingDto {
  role: Role;
  specialtyType?: SpecialtyType;
  crmvNumber?: string;
  crmvState?: string;
  phone?: string;
}
