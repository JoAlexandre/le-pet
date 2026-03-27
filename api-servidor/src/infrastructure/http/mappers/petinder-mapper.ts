import { PetinderProfile } from '../../../domain/entities/petinder-profile';
import { Animal } from '../../../domain/entities/animal';
import { PetinderProfileResponseDto } from '../../../application/dtos/petinder-profile-response-dto';

export class PetinderMapper {
  static toProfileResponse(
    profile: PetinderProfile,
    animal: Animal,
  ): PetinderProfileResponseDto {
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
