import { User } from '../../../domain/entities/user';
import { ProfessionalResponseDto } from '../../../application/dtos/professional-response-dto';

export class ProfessionalMapper {
  static toResponse(user: User): ProfessionalResponseDto {
    return {
      id: user.id!,
      name: user.name,
      email: user.email,
      specialtyType: user.specialtyType || null,
      crmvNumber: user.crmvNumber || null,
      crmvState: user.crmvState || null,
      crmvStatus: user.crmvStatus || null,
      phone: user.phone || null,
      isOnboardingComplete: user.isOnboardingComplete,
      createdAt: user.createdAt!,
      updatedAt: user.updatedAt!,
    };
  }
}
