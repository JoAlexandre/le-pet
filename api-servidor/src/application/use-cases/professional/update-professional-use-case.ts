import { UserRepository } from '../../../domain/repositories/user-repository';
import { UpdateProfessionalDto } from '../../dtos/update-professional-dto';
import { ProfessionalResponseDto } from '../../dtos/professional-response-dto';
import { ProfessionalMapper } from '../../../infrastructure/http/mappers/professional-mapper';
import { DomainError } from '../../../shared/errors';
import { Role } from '../../../domain/enums/role';
import { SpecialtyType } from '../../../domain/enums/specialty-type';
import { CrmvStatus } from '../../../domain/enums/crmv-status';

export class UpdateProfessionalUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(
    professionalId: string,
    requesterId: string,
    dto: UpdateProfessionalDto,
  ): Promise<ProfessionalResponseDto> {
    const user = await this.userRepository.findById(professionalId);
    if (!user || user.role !== Role.PROFESSIONAL) {
      throw new DomainError('Professional not found', 404);
    }

    // Somente o proprio profissional pode atualizar
    if (user.id !== requesterId) {
      throw new DomainError('Access denied: you can only update your own profile', 403);
    }

    if (dto.name !== undefined) {
      user.name = dto.name;
    }
    if (dto.phone !== undefined) {
      user.phone = dto.phone;
    }

    if (dto.specialtyType !== undefined) {
      user.specialtyType = dto.specialtyType as SpecialtyType;

      // Se mudou para VETERINARIAN, exige CRMV
      if (dto.specialtyType === (SpecialtyType.VETERINARIAN as string)) {
        if (!dto.crmvNumber && !user.crmvNumber) {
          throw new DomainError('CRMV number is required for veterinarians', 400);
        }
        if (!dto.crmvState && !user.crmvState) {
          throw new DomainError('CRMV state is required for veterinarians', 400);
        }
      }
    }

    if (dto.crmvNumber !== undefined) {
      user.crmvNumber = dto.crmvNumber;
      user.crmvStatus = CrmvStatus.PENDING;
    }
    if (dto.crmvState !== undefined) {
      user.crmvState = dto.crmvState;
    }

    const updated = await this.userRepository.update(user);
    return ProfessionalMapper.toResponse(updated);
  }
}
