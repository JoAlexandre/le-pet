import { PetinderSwipe } from '../../../domain/entities/petinder-swipe';
import { PetinderSwipeRepository } from '../../../domain/repositories/petinder-swipe-repository';
import { PetinderSwipeModel } from '../models/petinder-swipe-model';
import { PetinderSwipeDatabaseMapper } from '../mappers/petinder-swipe-database-mapper';

export class SequelizePetinderSwipeRepository implements PetinderSwipeRepository {
  async findByPair(
    swiperAnimalId: string,
    targetAnimalId: string,
  ): Promise<PetinderSwipe | null> {
    const model = await PetinderSwipeModel.findOne({
      where: { swiperAnimalId, targetAnimalId },
    });
    return model ? PetinderSwipeDatabaseMapper.toDomain(model) : null;
  }

  async findSwipedAnimalIds(swiperAnimalId: string): Promise<string[]> {
    const swipes = await PetinderSwipeModel.findAll({
      attributes: ['targetAnimalId'],
      where: { swiperAnimalId },
      raw: true,
    });
    return swipes.map((s) => s.targetAnimalId);
  }

  async create(swipe: PetinderSwipe): Promise<PetinderSwipe> {
    const data = PetinderSwipeDatabaseMapper.toModel(swipe);
    const model = await PetinderSwipeModel.create(data as PetinderSwipeModel);
    return PetinderSwipeDatabaseMapper.toDomain(model);
  }
}
