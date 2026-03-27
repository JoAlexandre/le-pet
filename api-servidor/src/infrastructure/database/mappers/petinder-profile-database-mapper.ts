import { PetinderProfile } from '../../../domain/entities/petinder-profile';
import { PetinderProfileModel } from '../models/petinder-profile-model';

export class PetinderProfileDatabaseMapper {
  static toDomain(model: PetinderProfileModel): PetinderProfile {
    return new PetinderProfile({
      id: model.id,
      animalId: model.animalId,
      description: model.description,
      isActive: model.isActive,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toModel(entity: PetinderProfile): Partial<PetinderProfileModel> {
    return {
      id: entity.id,
      animalId: entity.animalId,
      description: entity.description ?? null,
      isActive: entity.isActive,
    };
  }
}
