import { User } from '../../../domain/entities/user';

export class UserMapper {
  static toResponse(user: User): {
    id: string;
    name: string;
    email: string;
    role: string | null;
    specialtyType: string | null;
    crmvStatus: string | null;
    phone: string | null;
    isActive: boolean;
    isOnboardingComplete: boolean;
  } {
    return {
      id: user.id!,
      name: user.name,
      email: user.email,
      role: user.role || null,
      specialtyType: user.specialtyType || null,
      crmvStatus: user.crmvStatus || null,
      phone: user.phone || null,
      isActive: user.isActive,
      isOnboardingComplete: user.isOnboardingComplete,
    };
  }
}
