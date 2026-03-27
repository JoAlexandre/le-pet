import { AnimalRepository } from '../../../domain/repositories/animal-repository';
import { PetinderProfileRepository } from '../../../domain/repositories/petinder-profile-repository';
import { PetinderProfile } from '../../../domain/entities/petinder-profile';
import { EnablePetinderDto } from '../../dtos/enable-petinder-dto';
import { PetinderProfileResponseDto } from '../../dtos/petinder-profile-response-dto';
import { DomainError } from '../../../shared/errors';

export class EnablePetinderUseCase {
  constructor(
    private petinderProfileRepository: PetinderProfileRepository,
    private animalRepository: AnimalRepository,
  ) {}

  async execute(tutorId: string, dto: EnablePetinderDto): Promise<PetinderProfileResponseDto> {
    const animal = await this.animalRepository.findById(dto.animalId);
    if (!animal) {
      throw new DomainError('Animal not found', 404);
    }

    if (animal.tutorId !== tutorId) {
      throw new DomainError('You can only enable PeTinder for your own animals', 403);
    }

    const existing = await this.petinderProfileRepository.findByAnimalId(dto.animalId);
    if (existing) {
      if (existing.isActive) {
        throw new DomainError('PeTinder is already enabled for this animal', 409);
      }
      // Reativar perfil existente
      existing.isActive = true;
      existing.description = dto.description || existing.description;
      const updated = await this.petinderProfileRepository.update(existing);
      return {
        id: updated.id!,
        animalId: animal.id!,
        animalName: animal.name,
        species: animal.species,
        breed: animal.breed || null,
        gender: animal.gender,
        photoUrl: animal.photoUrl || null,
        description: updated.description || null,
        isActive: updated.isActive,
        createdAt: updated.createdAt!,
      };
    }

    const profile = new PetinderProfile({
      animalId: dto.animalId,
      description: dto.description || null,
      isActive: true,
    });

    const created = await this.petinderProfileRepository.create(profile);

    return {
      id: created.id!,
      animalId: animal.id!,
      animalName: animal.name,
      species: animal.species,
      breed: animal.breed || null,
      gender: animal.gender,
      photoUrl: animal.photoUrl || null,
      description: created.description || null,
      isActive: created.isActive,
      createdAt: created.createdAt!,
    };
  }
}
