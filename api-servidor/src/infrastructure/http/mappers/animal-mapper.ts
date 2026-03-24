import { Animal } from '../../../domain/entities/animal';
import { AnimalResponseDto } from '../../../application/dtos/animal-response-dto';

export class AnimalMapper {
  static toResponse(animal: Animal): AnimalResponseDto {
    return {
      id: animal.id!,
      tutorId: animal.tutorId,
      name: animal.name,
      species: animal.species,
      breed: animal.breed || null,
      gender: animal.gender,
      birthDate: animal.birthDate || null,
      weight: animal.weight ?? null,
      color: animal.color || null,
      microchipNumber: animal.microchipNumber || null,
      photoUrl: animal.photoUrl || null,
      allergies: animal.allergies || null,
      notes: animal.notes || null,
      createdAt: animal.createdAt!,
      updatedAt: animal.updatedAt!,
    };
  }
}
