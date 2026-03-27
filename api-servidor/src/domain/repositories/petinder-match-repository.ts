import { PetinderMatch } from '../entities/petinder-match';

export interface PetinderMatchRepository {
  findById(id: string): Promise<PetinderMatch | null>;
  findByAnimalIds(animalOneId: string, animalTwoId: string): Promise<PetinderMatch | null>;
  findByAnimalId(
    animalId: string,
    page: number,
    limit: number,
  ): Promise<{ rows: PetinderMatch[]; count: number }>;
  create(match: PetinderMatch): Promise<PetinderMatch>;
  deactivate(id: string): Promise<void>;
}
