import { User } from '../../../domain/entities/user';
import { AuthProvider } from '../../../domain/enums/auth-provider';
import { Role } from '../../../domain/enums/role';
import { SpecialtyType } from '../../../domain/enums/specialty-type';
import { CrmvStatus } from '../../../domain/enums/crmv-status';
import { UserModel } from '../models/user-model';

export class UserDatabaseMapper {
  static toDomain(model: UserModel): User {
    return new User({
      id: model.id,
      name: model.name,
      email: model.email,
      password: model.password,
      role: model.role as Role | null,
      authProvider: model.authProvider as AuthProvider,
      providerId: model.providerId,
      specialtyType: model.specialtyType as SpecialtyType | null,
      crmvNumber: model.crmvNumber,
      crmvState: model.crmvState,
      crmvStatus: model.crmvStatus as CrmvStatus | null,
      phone: model.phone,
      isActive: model.isActive,
      isOnboardingComplete: model.isOnboardingComplete,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      deletedAt: model.deletedAt,
    });
  }

  static toModel(entity: User): Partial<UserModel> {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      password: entity.password ?? null,
      role: entity.role ?? null,
      authProvider: entity.authProvider,
      providerId: entity.providerId ?? null,
      specialtyType: entity.specialtyType ?? null,
      crmvNumber: entity.crmvNumber ?? null,
      crmvState: entity.crmvState ?? null,
      crmvStatus: entity.crmvStatus ?? null,
      phone: entity.phone ?? null,
      isActive: entity.isActive,
      isOnboardingComplete: entity.isOnboardingComplete,
    };
  }
}
