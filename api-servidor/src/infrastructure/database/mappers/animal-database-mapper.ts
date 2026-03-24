import { Animal } from '../../../domain/entities/animal';
import { AnimalSpecies } from '../../../domain/enums/animal-species';
import { AnimalGender } from '../../../domain/enums/animal-gender';
import { AnimalModel } from '../models/animal-model';

export class AnimalDatabaseMapper {
  static toDomain(model: AnimalModel): Animal {
    return new Animal({
      id: model.id,
      tutorId: model.tutorId,
      name: model.name,
      species: model.species as AnimalSpecies,
      breed: model.breed,
      gender: model.gender as AnimalGender,
      birthDate: model.birthDate ? new Date(model.birthDate) : null,
      weight: model.weight ? Number(model.weight) : null,
      color: model.color,
      microchipNumber: model.microchipNumber,
      photoUrl: model.photoUrl,
      allergies: model.allergies,
      notes: model.notes,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      deletedAt: model.deletedAt,
    });
  }

  static toModel(entity: Animal): Partial<AnimalModel> {
    return {
      id: entity.id,
      tutorId: entity.tutorId,
      name: entity.name,
      species: entity.species,
      breed: entity.breed ?? null,
      gender: entity.gender,
      birthDate: entity.birthDate ?? null,
      weight: entity.weight ?? null,
      color: entity.color ?? null,
      microchipNumber: entity.microchipNumber ?? null,
      photoUrl: entity.photoUrl ?? null,
      allergies: entity.allergies ?? null,
      notes: entity.notes ?? null,
    };
  }
}
