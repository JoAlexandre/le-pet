import { LostAnimal } from '../entities/lost-animal';

export interface LostAnimalRepository {
  findById(id: string): Promise<LostAnimal | null>;
  findAll(
    page: number,
    limit: number,
    filters?: {
      state?: string;
      city?: string;
      status?: string;
      tutorId?: string;
    },
  ): Promise<{ rows: LostAnimal[]; count: number }>;
  findByTutorId(
    tutorId: string,
    page: number,
    limit: number,
  ): Promise<{ rows: LostAnimal[]; count: number }>;
  create(lostAnimal: LostAnimal): Promise<LostAnimal>;
  update(lostAnimal: LostAnimal): Promise<LostAnimal>;
  softDelete(id: string): Promise<void>;
}
