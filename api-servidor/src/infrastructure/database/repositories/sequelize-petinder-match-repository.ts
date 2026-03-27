import { Op } from 'sequelize';
import { PetinderMatch } from '../../../domain/entities/petinder-match';
import { PetinderMatchRepository } from '../../../domain/repositories/petinder-match-repository';
import { PetinderMatchModel } from '../models/petinder-match-model';
import { PetinderMatchDatabaseMapper } from '../mappers/petinder-match-database-mapper';

export class SequelizePetinderMatchRepository implements PetinderMatchRepository {
  async findById(id: string): Promise<PetinderMatch | null> {
    const model = await PetinderMatchModel.findByPk(id);
    return model ? PetinderMatchDatabaseMapper.toDomain(model) : null;
  }

  async findByAnimalIds(
    animalOneId: string,
    animalTwoId: string,
  ): Promise<PetinderMatch | null> {
    const model = await PetinderMatchModel.findOne({
      where: {
        [Op.or]: [
          { animalOneId, animalTwoId },
          { animalOneId: animalTwoId, animalTwoId: animalOneId },
        ],
      },
    });
    return model ? PetinderMatchDatabaseMapper.toDomain(model) : null;
  }

  async findByAnimalId(
    animalId: string,
    page: number,
    limit: number,
  ): Promise<{ rows: PetinderMatch[]; count: number }> {
    const offset = (page - 1) * limit;
    const { rows, count } = await PetinderMatchModel.findAndCountAll({
      where: {
        isActive: true,
        [Op.or]: [{ animalOneId: animalId }, { animalTwoId: animalId }],
      },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      rows: rows.map((row) => PetinderMatchDatabaseMapper.toDomain(row)),
      count,
    };
  }

  async create(match: PetinderMatch): Promise<PetinderMatch> {
    const data = PetinderMatchDatabaseMapper.toModel(match);
    const model = await PetinderMatchModel.create(data as PetinderMatchModel);
    return PetinderMatchDatabaseMapper.toDomain(model);
  }

  async deactivate(id: string): Promise<void> {
    await PetinderMatchModel.update({ isActive: false }, { where: { id } });
  }
}
