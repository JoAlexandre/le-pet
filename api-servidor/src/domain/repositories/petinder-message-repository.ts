import { PetinderMessage } from '../entities/petinder-message';

export interface PetinderMessageRepository {
  findByMatchId(
    matchId: string,
    page: number,
    limit: number,
  ): Promise<{ rows: PetinderMessage[]; count: number }>;
  create(message: PetinderMessage): Promise<PetinderMessage>;
}
