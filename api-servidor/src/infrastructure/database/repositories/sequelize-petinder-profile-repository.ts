import { Op } from 'sequelize';
import { PetinderProfile } from '../../../domain/entities/petinder-profile';
import { PetinderProfileRepository } from '../../../domain/repositories/petinder-profile-repository';
import { PetinderProfileModel } from '../models/petinder-profile-model';
import { PetinderProfileDatabaseMapper } from '../mappers/petinder-profile-database-mapper';
import { AnimalModel } from '../models/animal-model';

export class SequelizePetinderProfileRepository implements PetinderProfileRepository {
  async findById(id: string): Promise<PetinderProfile | null> {
    const model = await PetinderProfileModel.findByPk(id);
    return model ? PetinderProfileDatabaseMapper.toDomain(model) : null;
  }

  async findByAnimalId(animalId: string): Promise<PetinderProfile | null> {
    const model = await PetinderProfileModel.findOne({ where: { animalId } });
    return model ? PetinderProfileDatabaseMapper.toDomain(model) : null;
  }

  async findActiveBySpecies(
    species: string,
    excludeAnimalIds: string[],
    page: number,
    limit: number,
  ): Promise<{ rows: PetinderProfile[]; count: number }> {
    const offset = (page - 1) * limit;

    const animalIds = await AnimalModel.findAll({
      attributes: ['id'],
      where: {
        species,
        ...(excludeAnimalIds.length > 0 ? { id: { [Op.notIn]: excludeAnimalIds } } : {}),
      },
      raw: true,
    });

    const validAnimalIds = animalIds.map((a) => a.id);

    if (validAnimalIds.length === 0) {
      return { rows: [], count: 0 };
    }

    const { rows, count } = await PetinderProfileModel.findAndCountAll({
      where: {
        isActive: true,
        animalId: { [Op.in]: validAnimalIds },
      },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      rows: rows.map((row) => PetinderProfileDatabaseMapper.toDomain(row)),
      count,
    };
  }

  async create(profile: PetinderProfile): Promise<PetinderProfile> {
    const data = PetinderProfileDatabaseMapper.toModel(profile);
    const model = await PetinderProfileModel.create(data as PetinderProfileModel);
    return PetinderProfileDatabaseMapper.toDomain(model);
  }

  async update(profile: PetinderProfile): Promise<PetinderProfile> {
    const data = PetinderProfileDatabaseMapper.toModel(profile);
    await PetinderProfileModel.update(data, { where: { id: profile.id } });
    const updated = await PetinderProfileModel.findByPk(profile.id);
    return PetinderProfileDatabaseMapper.toDomain(updated!);
  }
}
