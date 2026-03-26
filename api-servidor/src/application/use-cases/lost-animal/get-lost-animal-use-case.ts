import { LostAnimalRepository } from '../../../domain/repositories/lost-animal-repository';
import { LostAnimalMediaRepository } from '../../../domain/repositories/lost-animal-media-repository';
import { LostAnimalResponseDto } from '../../dtos/lost-animal-response-dto';
import { LostAnimalMapper } from '../../../infrastructure/http/mappers/lost-animal-mapper';
import { DomainError } from '../../../shared/errors';

export class GetLostAnimalUseCase {
  constructor(
    private lostAnimalRepository: LostAnimalRepository,
    private lostAnimalMediaRepository: LostAnimalMediaRepository,
  ) {}

  async execute(id: string): Promise<LostAnimalResponseDto> {
    const lostAnimal = await this.lostAnimalRepository.findById(id);
    if (!lostAnimal) {
      throw new DomainError('Lost animal post not found', 404);
    }

    const media = await this.lostAnimalMediaRepository.findByLostAnimalId(id);
    lostAnimal.media = media;

    return LostAnimalMapper.toResponse(lostAnimal);
  }
}
