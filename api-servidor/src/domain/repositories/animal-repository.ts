import { Animal } from '../entities/animal';

export interface AnimalRepository {
  findById(id: string): Promise<Animal | null>;
  findByTutorId(
    tutorId: string,
    page: number,
    limit: number,
  ): Promise<{ rows: Animal[]; count: number }>;
  countByTutorId(tutorId: string): Promise<number>;
  create(animal: Animal): Promise<Animal>;
  update(animal: Animal): Promise<Animal>;
  softDelete(id: string): Promise<void>;
}
