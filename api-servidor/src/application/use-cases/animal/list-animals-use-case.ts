import { AnimalRepository } from '../../../domain/repositories/animal-repository';
import { AnimalResponseDto } from '../../dtos/animal-response-dto';
import { AnimalMapper } from '../../../infrastructure/http/mappers/animal-mapper';
import { PaginatedResult } from '../../../shared/interfaces/pagination';

export class ListAnimalsUseCase {
  constructor(private animalRepository: AnimalRepository) {}

  async execute(
    tutorId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<AnimalResponseDto>> {
    const { rows, count } = await this.animalRepository.findByTutorId(tutorId, page, limit);

    return {
      data: rows.map((row) => AnimalMapper.toResponse(row)),
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }
}
