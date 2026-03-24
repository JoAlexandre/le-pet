import { AnimalRepository } from '../../../domain/repositories/animal-repository';
import { AnimalResponseDto } from '../../dtos/animal-response-dto';
import { AnimalMapper } from '../../../infrastructure/http/mappers/animal-mapper';
import { DomainError } from '../../../shared/errors';

export class GetAnimalUseCase {
  constructor(private animalRepository: AnimalRepository) {}

  async execute(id: string, tutorId: string): Promise<AnimalResponseDto> {
    const animal = await this.animalRepository.findById(id);
    if (!animal) {
      throw new DomainError('Animal not found', 404);
    }

    // Tutor so pode ver seus proprios animais
    if (animal.tutorId !== tutorId) {
      throw new DomainError('Access denied: you are not the owner of this animal', 403);
    }

    return AnimalMapper.toResponse(animal);
  }
}
