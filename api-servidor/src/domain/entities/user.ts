import { Role } from '../enums/role';
import { AuthProvider } from '../enums/auth-provider';
import { SpecialtyType } from '../enums/specialty-type';
import { CrmvStatus } from '../enums/crmv-status';

export interface UserProps {
  id?: string;
  name: string;
  email: string;
  password?: string | null;
  role?: Role | null;
  authProvider: AuthProvider;
  providerId?: string | null;
  specialtyType?: SpecialtyType | null;
  crmvNumber?: string | null;
  crmvState?: string | null;
  crmvStatus?: CrmvStatus | null;
  phone?: string | null;
  isActive: boolean;
  isOnboardingComplete: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class User {
  public readonly id?: string;
  public name: string;
  public email: string;
  public password?: string | null;
  public role?: Role | null;
  public authProvider: AuthProvider;
  public providerId?: string | null;
  public specialtyType?: SpecialtyType | null;
  public crmvNumber?: string | null;
  public crmvState?: string | null;
  public crmvStatus?: CrmvStatus | null;
  public phone?: string | null;
  public isActive: boolean;
  public isOnboardingComplete: boolean;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
  public readonly deletedAt?: Date | null;

  constructor(props: UserProps) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
    this.role = props.role;
    this.authProvider = props.authProvider;
    this.providerId = props.providerId;
    this.specialtyType = props.specialtyType;
    this.crmvNumber = props.crmvNumber;
    this.crmvState = props.crmvState;
    this.crmvStatus = props.crmvStatus;
    this.phone = props.phone;
    this.isActive = props.isActive;
    this.isOnboardingComplete = props.isOnboardingComplete;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
  }
}
