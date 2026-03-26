import { Op } from 'sequelize';
import { VaccineRecord } from '../../../domain/entities/vaccine-record';
import { VaccineRecordRepository } from '../../../domain/repositories/vaccine-record-repository';
import { VaccineRecordModel } from '../models/vaccine-record-model';
import { AnimalModel } from '../models/animal-model';
import { VaccineRecordDatabaseMapper } from '../mappers/vaccine-record-database-mapper';

export class SequelizeVaccineRecordRepository implements VaccineRecordRepository {
  async findById(id: string): Promise<VaccineRecord | null> {
    const model = await VaccineRecordModel.findByPk(id);
    return model ? VaccineRecordDatabaseMapper.toDomain(model) : null;
  }

  async findAll(page: number, limit: number): Promise<{ rows: VaccineRecord[]; count: number }> {
    const offset = (page - 1) * limit;
    const { rows, count } = await VaccineRecordModel.findAndCountAll({
      limit,
      offset,
      order: [['applicationDate', 'DESC']],
    });

    return {
      rows: rows.map((row) => VaccineRecordDatabaseMapper.toDomain(row)),
      count,
    };
  }

  async findByAnimalId(
    animalId: string,
    page: number,
    limit: number,
  ): Promise<{ rows: VaccineRecord[]; count: number }> {
    const offset = (page - 1) * limit;
    const { rows, count } = await VaccineRecordModel.findAndCountAll({
      where: { animalId },
      limit,
      offset,
      order: [['applicationDate', 'DESC']],
    });

    return {
      rows: rows.map((row) => VaccineRecordDatabaseMapper.toDomain(row)),
      count,
    };
  }

  async findByTutorId(
    tutorId: string,
    page: number,
    limit: number,
  ): Promise<{ rows: VaccineRecord[]; count: number }> {
    const offset = (page - 1) * limit;

    // Buscar IDs dos animais do tutor
    const animalIds = await AnimalModel.findAll({
      attributes: ['id'],
      where: { tutorId },
    });

    if (animalIds.length === 0) {
      return { rows: [], count: 0 };
    }

    const ids = animalIds.map((a) => a.id);
    const { rows, count } = await VaccineRecordModel.findAndCountAll({
      where: { animalId: { [Op.in]: ids } },
      limit,
      offset,
      order: [['applicationDate', 'DESC']],
    });

    return {
      rows: rows.map((row) => VaccineRecordDatabaseMapper.toDomain(row)),
      count,
    };
  }

  async findByProfessionalId(
    professionalId: string,
    page: number,
    limit: number,
  ): Promise<{ rows: VaccineRecord[]; count: number }> {
    const offset = (page - 1) * limit;
    const { rows, count } = await VaccineRecordModel.findAndCountAll({
      where: { professionalId },
      limit,
      offset,
      order: [['applicationDate', 'DESC']],
    });

    return {
      rows: rows.map((row) => VaccineRecordDatabaseMapper.toDomain(row)),
      count,
    };
  }

  async create(vaccineRecord: VaccineRecord): Promise<VaccineRecord> {
    const data = VaccineRecordDatabaseMapper.toModel(vaccineRecord);
    const model = await VaccineRecordModel.create(data as VaccineRecordModel);
    return VaccineRecordDatabaseMapper.toDomain(model);
  }
}
