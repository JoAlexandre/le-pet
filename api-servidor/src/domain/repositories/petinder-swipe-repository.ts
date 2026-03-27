import { PetinderSwipe } from '../entities/petinder-swipe';

export interface PetinderSwipeRepository {
  findByPair(swiperAnimalId: string, targetAnimalId: string): Promise<PetinderSwipe | null>;
  findSwipedAnimalIds(swiperAnimalId: string): Promise<string[]>;
  create(swipe: PetinderSwipe): Promise<PetinderSwipe>;
}
