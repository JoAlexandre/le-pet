import { Animal } from '../../../domain/entities/animal';
import { AnimalRepository } from '../../../domain/repositories/animal-repository';
import { AnimalModel } from '../models/animal-model';
import { AnimalDatabaseMapper } from '../mappers/animal-database-mapper';

export class SequelizeAnimalRepository implements AnimalRepository {
  async findById(id: string): Promise<Animal | null> {
    const model = await AnimalModel.findByPk(id);
    return model ? AnimalDatabaseMapper.toDomain(model) : null;
  }

  async findByTutorId(
    tutorId: string,
    page: number,
    limit: number,
  ): Promise<{ rows: Animal[]; count: number }> {
    const offset = (page - 1) * limit;
    const { rows, count } = await AnimalModel.findAndCountAll({
      where: { tutorId },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      rows: rows.map((row) => AnimalDatabaseMapper.toDomain(row)),
      count,
    };
  }

  async countByTutorId(tutorId: string): Promise<number> {
    return AnimalModel.count({
      where: { tutorId },
    });
  }

  async create(animal: Animal): Promise<Animal> {
    const data = AnimalDatabaseMapper.toModel(animal);
    const model = await AnimalModel.create(data as AnimalModel);
    return AnimalDatabaseMapper.toDomain(model);
  }

  async update(animal: Animal): Promise<Animal> {
    const data = AnimalDatabaseMapper.toModel(animal);
    await AnimalModel.update(data, { where: { id: animal.id } });
    const updated = await AnimalModel.findByPk(animal.id);
    return AnimalDatabaseMapper.toDomain(updated!);
  }

  async softDelete(id: string): Promise<void> {
    await AnimalModel.destroy({ where: { id } });
  }
}
