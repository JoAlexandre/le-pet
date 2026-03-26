import { LostAnimalRepository } from '../../../domain/repositories/lost-animal-repository';
import { LostAnimalMediaRepository } from '../../../domain/repositories/lost-animal-media-repository';
import { LostAnimalStatus } from '../../../domain/enums/lost-animal-status';
import { UpdateLostAnimalDto } from '../../dtos/update-lost-animal-dto';
import { LostAnimalResponseDto } from '../../dtos/lost-animal-response-dto';
import { LostAnimalMapper } from '../../../infrastructure/http/mappers/lost-animal-mapper';
import { DomainError } from '../../../shared/errors';

export class UpdateLostAnimalUseCase {
  constructor(
    private lostAnimalRepository: LostAnimalRepository,
    private lostAnimalMediaRepository: LostAnimalMediaRepository,
  ) {}

  async execute(
    id: string,
    tutorId: string,
    dto: UpdateLostAnimalDto,
  ): Promise<LostAnimalResponseDto> {
    const lostAnimal = await this.lostAnimalRepository.findById(id);
    if (!lostAnimal) {
      throw new DomainError('Lost animal post not found', 404);
    }

    if (lostAnimal.tutorId !== tutorId) {
      throw new DomainError('Access denied: you are not the owner of this post', 403);
    }

    if (dto.status !== undefined) {
      if (!Object.values(LostAnimalStatus).includes(dto.status as LostAnimalStatus)) {
        throw new DomainError(
          `Invalid status. Must be one of: ${Object.values(LostAnimalStatus).join(', ')}`,
          400,
        );
      }
      lostAnimal.status = dto.status as LostAnimalStatus;
    }

    if (dto.title !== undefined) lostAnimal.title = dto.title;
    if (dto.description !== undefined) lostAnimal.description = dto.description || null;
    if (dto.state !== undefined) lostAnimal.state = dto.state;
    if (dto.city !== undefined) lostAnimal.city = dto.city;
    if (dto.lastSeenLocation !== undefined) {
      lostAnimal.lastSeenLocation = dto.lastSeenLocation || null;
    }
    if (dto.contactPhone !== undefined) lostAnimal.contactPhone = dto.contactPhone || null;

    if (dto.lastSeenDate !== undefined) {
      if (dto.lastSeenDate) {
        const parsed = new Date(dto.lastSeenDate);
        if (isNaN(parsed.getTime())) {
          throw new DomainError('Invalid last seen date format', 400);
        }
        lostAnimal.lastSeenDate = parsed;
      } else {
        lostAnimal.lastSeenDate = null;
      }
    }

    const updated = await this.lostAnimalRepository.update(lostAnimal);
    const media = await this.lostAnimalMediaRepository.findByLostAnimalId(id);
    updated.media = media;

    return LostAnimalMapper.toResponse(updated);
  }
}
