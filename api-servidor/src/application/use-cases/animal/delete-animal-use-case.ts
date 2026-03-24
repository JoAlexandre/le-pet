import { AnimalRepository } from '../../../domain/repositories/animal-repository';
import { DomainError } from '../../../shared/errors';

export class DeleteAnimalUseCase {
  constructor(private animalRepository: AnimalRepository) {}

  async execute(animalId: string, tutorId: string): Promise<void> {
    const animal = await this.animalRepository.findById(animalId);
    if (!animal) {
      throw new DomainError('Animal not found', 404);
    }

    if (animal.tutorId !== tutorId) {
      throw new DomainError('Access denied: you are not the owner of this animal', 403);
    }

    await this.animalRepository.softDelete(animalId);
  }
}
