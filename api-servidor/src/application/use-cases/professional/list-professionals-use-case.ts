import { UserRepository } from '../../../domain/repositories/user-repository';
import { ProfessionalResponseDto } from '../../dtos/professional-response-dto';
import { ProfessionalMapper } from '../../../infrastructure/http/mappers/professional-mapper';
import { PaginatedResult } from '../../../shared/interfaces/pagination';
import { Role } from '../../../domain/enums/role';

export class ListProfessionalsUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(page: number, limit: number): Promise<PaginatedResult<ProfessionalResponseDto>> {
    const { rows, count } = await this.userRepository.findAllByRole(Role.PROFESSIONAL, page, limit);

    return {
      data: rows.map((row) => ProfessionalMapper.toResponse(row)),
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }
}
