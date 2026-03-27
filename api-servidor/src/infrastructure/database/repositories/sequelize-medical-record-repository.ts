import { Op } from 'sequelize';
import { MedicalRecord } from '../../../domain/entities/medical-record';
import { MedicalRecordRepository } from '../../../domain/repositories/medical-record-repository';
import { MedicalRecordModel } from '../models/medical-record-model';
import { MedicalRecordDatabaseMapper } from '../mappers/medical-record-database-mapper';

export class SequelizeMedicalRecordRepository implements MedicalRecordRepository {
  async findById(id: string): Promise<MedicalRecord | null> {
    const model = await MedicalRecordModel.findOne({
      where: { id, isActive: true },
    });
    return model ? MedicalRecordDatabaseMapper.toDomain(model) : null;
  }

  async findByAnimalId(
    animalId: string,
    page: number,
    limit: number,
  ): Promise<{ rows: MedicalRecord[]; count: number }> {
    const offset = (page - 1) * limit;
    const { rows, count } = await MedicalRecordModel.findAndCountAll({
      where: { animalId, isActive: true },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      rows: rows.map((row) => MedicalRecordDatabaseMapper.toDomain(row)),
      count,
    };
  }

  async findByProfessionalId(
    professionalId: string,
    page: number,
    limit: number,
  ): Promise<{ rows: MedicalRecord[]; count: number }> {
    const offset = (page - 1) * limit;
    const { rows, count } = await MedicalRecordModel.findAndCountAll({
      where: { professionalId, isActive: true },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      rows: rows.map((row) => MedicalRecordDatabaseMapper.toDomain(row)),
      count,
    };
  }

  async findByAnimalIdAndType(
    animalId: string,
    type: string,
    page: number,
    limit: number,
  ): Promise<{ rows: MedicalRecord[]; count: number }> {
    const offset = (page - 1) * limit;
    const { rows, count } = await MedicalRecordModel.findAndCountAll({
      where: { animalId, type, isActive: true },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      rows: rows.map((row) => MedicalRecordDatabaseMapper.toDomain(row)),
      count,
    };
  }

  async create(medicalRecord: MedicalRecord): Promise<MedicalRecord> {
    const data = MedicalRecordDatabaseMapper.toModel(medicalRecord);
    const model = await MedicalRecordModel.create(data as MedicalRecordModel);
    return MedicalRecordDatabaseMapper.toDomain(model);
  }

  async update(medicalRecord: MedicalRecord): Promise<MedicalRecord> {
    const data = MedicalRecordDatabaseMapper.toModel(medicalRecord);
    await MedicalRecordModel.update(data, {
      where: { id: medicalRecord.id },
    });
    const updated = await MedicalRecordModel.findByPk(medicalRecord.id);
    return MedicalRecordDatabaseMapper.toDomain(updated!);
  }

  async countByProfessionalIdInMonth(
    professionalId: string,
    year: number,
    month: number,
  ): Promise<number> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);
    return MedicalRecordModel.count({
      where: {
        professionalId,
        isActive: true,
        createdAt: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
      },
    });
  }

  async softDelete(id: string): Promise<void> {
    await MedicalRecordModel.update(
      { isActive: false },
      { where: { id } },
    );
  }
}
