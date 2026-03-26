import { LostAnimalRepository } from '../../../domain/repositories/lost-animal-repository';
import { LostAnimalMediaRepository } from '../../../domain/repositories/lost-animal-media-repository';
import { LostAnimalResponseDto } from '../../dtos/lost-animal-response-dto';
import { LostAnimalMapper } from '../../../infrastructure/http/mappers/lost-animal-mapper';
import { PaginatedResult } from '../../../shared/interfaces/pagination';

export class ListMyLostAnimalsUseCase {
  constructor(
    private lostAnimalRepository: LostAnimalRepository,
    private lostAnimalMediaRepository: LostAnimalMediaRepository,
  ) {}

  async execute(
    tutorId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<LostAnimalResponseDto>> {
    const { rows, count } = await this.lostAnimalRepository.findByTutorId(tutorId, page, limit);

    const data = await Promise.all(
      rows.map(async (lostAnimal) => {
        const media = await this.lostAnimalMediaRepository.findByLostAnimalId(lostAnimal.id!);
        lostAnimal.media = media;
        return LostAnimalMapper.toResponse(lostAnimal);
      }),
    );

    return {
      data,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }
}
