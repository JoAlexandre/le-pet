import { UserRepository } from '../../../domain/repositories/user-repository';
import { ProfessionalResponseDto } from '../../dtos/professional-response-dto';
import { ProfessionalMapper } from '../../../infrastructure/http/mappers/professional-mapper';
import { DomainError } from '../../../shared/errors';
import { Role } from '../../../domain/enums/role';

export class GetProfessionalUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string): Promise<ProfessionalResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user || user.role !== Role.PROFESSIONAL) {
      throw new DomainError('Professional not found', 404);
    }

    return ProfessionalMapper.toResponse(user);
  }
}
