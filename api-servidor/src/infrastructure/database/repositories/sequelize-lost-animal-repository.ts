import { Op } from 'sequelize';
import { LostAnimal } from '../../../domain/entities/lost-animal';
import { LostAnimalRepository } from '../../../domain/repositories/lost-animal-repository';
import { LostAnimalModel } from '../models/lost-animal-model';
import { LostAnimalDatabaseMapper } from '../mappers/lost-animal-database-mapper';

export class SequelizeLostAnimalRepository implements LostAnimalRepository {
  async findById(id: string): Promise<LostAnimal | null> {
    const model = await LostAnimalModel.findByPk(id);
    return model ? LostAnimalDatabaseMapper.toDomain(model) : null;
  }

  async findAll(
    page: number,
    limit: number,
    filters?: {
      state?: string;
      city?: string;
      status?: string;
      tutorId?: string;
    },
  ): Promise<{ rows: LostAnimal[]; count: number }> {
    const offset = (page - 1) * limit;
    const where: Record<string, unknown> = { isActive: true };

    if (filters?.state) {
      where.state = filters.state;
    }
    if (filters?.city) {
      where.city = { [Op.like]: `%${filters.city}%` };
    }
    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.tutorId) {
      where.tutorId = filters.tutorId;
    }

    const { rows, count } = await LostAnimalModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      rows: rows.map((row) => LostAnimalDatabaseMapper.toDomain(row)),
      count,
    };
  }

  async findByTutorId(
    tutorId: string,
    page: number,
    limit: number,
  ): Promise<{ rows: LostAnimal[]; count: number }> {
    const offset = (page - 1) * limit;
    const { rows, count } = await LostAnimalModel.findAndCountAll({
      where: { tutorId },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      rows: rows.map((row) => LostAnimalDatabaseMapper.toDomain(row)),
      count,
    };
  }

  async create(lostAnimal: LostAnimal): Promise<LostAnimal> {
    const data = LostAnimalDatabaseMapper.toModel(lostAnimal);
    const model = await LostAnimalModel.create(data as LostAnimalModel);
    return LostAnimalDatabaseMapper.toDomain(model);
  }

  async update(lostAnimal: LostAnimal): Promise<LostAnimal> {
    const data = LostAnimalDatabaseMapper.toModel(lostAnimal);
    await LostAnimalModel.update(data, { where: { id: lostAnimal.id } });
    const updated = await LostAnimalModel.findByPk(lostAnimal.id);
    return LostAnimalDatabaseMapper.toDomain(updated!);
  }

  async softDelete(id: string): Promise<void> {
    await LostAnimalModel.destroy({ where: { id } });
  }
}
