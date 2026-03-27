import { AnimalRepository } from '../../../domain/repositories/animal-repository';
import { PetinderProfileRepository } from '../../../domain/repositories/petinder-profile-repository';
import { PetinderProfileResponseDto } from '../../dtos/petinder-profile-response-dto';
import { DomainError } from '../../../shared/errors';

export class GetPetinderProfileUseCase {
  constructor(
    private petinderProfileRepository: PetinderProfileRepository,
    private animalRepository: AnimalRepository,
  ) {}

  async execute(animalId: string): Promise<PetinderProfileResponseDto> {
    const profile = await this.petinderProfileRepository.findByAnimalId(animalId);
    if (!profile) {
      throw new DomainError('PeTinder profile not found for this animal', 404);
    }

    const animal = await this.animalRepository.findById(animalId);
    if (!animal) {
      throw new DomainError('Animal not found', 404);
    }

    return {
      id: profile.id!,
      animalId: animal.id!,
      animalName: animal.name,
      species: animal.species,
      breed: animal.breed || null,
      gender: animal.gender,
      photoUrl: animal.photoUrl || null,
      description: profile.description || null,
      isActive: profile.isActive,
      createdAt: profile.createdAt!,
    };
  }
}
