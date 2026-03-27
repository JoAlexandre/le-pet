import { AnimalRepository } from '../../../domain/repositories/animal-repository';
import { PetinderProfileRepository } from '../../../domain/repositories/petinder-profile-repository';
import { DomainError } from '../../../shared/errors';

export class DisablePetinderUseCase {
  constructor(
    private petinderProfileRepository: PetinderProfileRepository,
    private animalRepository: AnimalRepository,
  ) {}

  async execute(tutorId: string, animalId: string): Promise<void> {
    const animal = await this.animalRepository.findById(animalId);
    if (!animal) {
      throw new DomainError('Animal not found', 404);
    }

    if (animal.tutorId !== tutorId) {
      throw new DomainError('You can only disable PeTinder for your own animals', 403);
    }

    const profile = await this.petinderProfileRepository.findByAnimalId(animalId);
    if (!profile || !profile.isActive) {
      throw new DomainError('PeTinder is not enabled for this animal', 404);
    }

    profile.isActive = false;
    await this.petinderProfileRepository.update(profile);
  }
}
