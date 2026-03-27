import { PetinderMessage } from '../../../domain/entities/petinder-message';
import { PetinderMessageRepository } from '../../../domain/repositories/petinder-message-repository';
import { PetinderMessageModel } from '../models/petinder-message-model';
import { PetinderMessageDatabaseMapper } from '../mappers/petinder-message-database-mapper';

export class SequelizePetinderMessageRepository implements PetinderMessageRepository {
  async findByMatchId(
    matchId: string,
    page: number,
    limit: number,
  ): Promise<{ rows: PetinderMessage[]; count: number }> {
    const offset = (page - 1) * limit;
    const { rows, count } = await PetinderMessageModel.findAndCountAll({
      where: { matchId },
      limit,
      offset,
      order: [['createdAt', 'ASC']],
    });

    return {
      rows: rows.map((row) => PetinderMessageDatabaseMapper.toDomain(row)),
      count,
    };
  }

  async create(message: PetinderMessage): Promise<PetinderMessage> {
    const data = PetinderMessageDatabaseMapper.toModel(message);
    const model = await PetinderMessageModel.create(data as PetinderMessageModel);
    return PetinderMessageDatabaseMapper.toDomain(model);
  }
}
