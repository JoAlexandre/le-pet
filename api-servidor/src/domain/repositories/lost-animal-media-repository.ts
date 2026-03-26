import { LostAnimalMedia } from '../entities/lost-animal-media';

export interface LostAnimalMediaRepository {
  findByLostAnimalId(lostAnimalId: string): Promise<LostAnimalMedia[]>;
  bulkCreate(media: LostAnimalMedia[]): Promise<LostAnimalMedia[]>;
  deleteByLostAnimalId(lostAnimalId: string): Promise<void>;
}
