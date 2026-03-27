import { PetinderSwipe } from '../../../domain/entities/petinder-swipe';
import { PetinderSwipeModel } from '../models/petinder-swipe-model';

export class PetinderSwipeDatabaseMapper {
  static toDomain(model: PetinderSwipeModel): PetinderSwipe {
    return new PetinderSwipe({
      id: model.id,
      swiperAnimalId: model.swiperAnimalId,
      targetAnimalId: model.targetAnimalId,
      isLike: model.isLike,
      createdAt: model.createdAt,
    });
  }

  static toModel(entity: PetinderSwipe): Partial<PetinderSwipeModel> {
    return {
      id: entity.id,
      swiperAnimalId: entity.swiperAnimalId,
      targetAnimalId: entity.targetAnimalId,
      isLike: entity.isLike,
    };
  }
}
