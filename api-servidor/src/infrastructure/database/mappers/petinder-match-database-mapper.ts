import { PetinderMatch } from '../../../domain/entities/petinder-match';
import { PetinderMatchModel } from '../models/petinder-match-model';

export class PetinderMatchDatabaseMapper {
  static toDomain(model: PetinderMatchModel): PetinderMatch {
    return new PetinderMatch({
      id: model.id,
      animalOneId: model.animalOneId,
      animalTwoId: model.animalTwoId,
      isActive: model.isActive,
      createdAt: model.createdAt,
    });
  }

  static toModel(entity: PetinderMatch): Partial<PetinderMatchModel> {
    return {
      id: entity.id,
      animalOneId: entity.animalOneId,
      animalTwoId: entity.animalTwoId,
      isActive: entity.isActive,
    };
  }
}
