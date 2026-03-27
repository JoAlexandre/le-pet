import { PetinderProfile } from '../entities/petinder-profile';

export interface PetinderProfileRepository {
  findById(id: string): Promise<PetinderProfile | null>;
  findByAnimalId(animalId: string): Promise<PetinderProfile | null>;
  findActiveBySpecies(
    species: string,
    excludeAnimalIds: string[],
    page: number,
    limit: number,
  ): Promise<{ rows: PetinderProfile[]; count: number }>;
  create(profile: PetinderProfile): Promise<PetinderProfile>;
  update(profile: PetinderProfile): Promise<PetinderProfile>;
}
