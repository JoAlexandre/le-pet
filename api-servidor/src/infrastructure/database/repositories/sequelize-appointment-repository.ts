import { Op } from 'sequelize';
import { Appointment } from '../../../domain/entities/appointment';
import { AppointmentRepository } from '../../../domain/repositories/appointment-repository';
import { AppointmentStatus } from '../../../domain/enums/appointment-status';
import { AppointmentModel } from '../models/appointment-model';
import { AppointmentDatabaseMapper } from '../mappers/appointment-database-mapper';

export class SequelizeAppointmentRepository implements AppointmentRepository {
  async findById(id: string): Promise<Appointment | null> {
    const model = await AppointmentModel.findByPk(id);
    return model ? AppointmentDatabaseMapper.toDomain(model) : null;
  }

  async findByTutorId(
    tutorId: string,
    page: number,
    limit: number,
  ): Promise<{ rows: Appointment[]; count: number }> {
    const offset = (page - 1) * limit;
    const { rows, count } = await AppointmentModel.findAndCountAll({
      where: { tutorId },
      limit,
      offset,
      order: [['scheduledDate', 'DESC'], ['startTime', 'DESC']],
    });

    return {
      rows: rows.map((r) => AppointmentDatabaseMapper.toDomain(r)),
      count,
    };
  }

  async findByProfessionalId(
    professionalId: string,
    page: number,
    limit: number,
  ): Promise<{ rows: Appointment[]; count: number }> {
    const offset = (page - 1) * limit;
    const { rows, count } = await AppointmentModel.findAndCountAll({
      where: { professionalId },
      limit,
      offset,
      order: [['scheduledDate', 'DESC'], ['startTime', 'DESC']],
    });

    return {
      rows: rows.map((r) => AppointmentDatabaseMapper.toDomain(r)),
      count,
    };
  }

  async findByCompanyId(
    companyId: string,
    page: number,
    limit: number,
  ): Promise<{ rows: Appointment[]; count: number }> {
    const offset = (page - 1) * limit;
    const { rows, count } = await AppointmentModel.findAndCountAll({
      where: { companyId },
      limit,
      offset,
      order: [['scheduledDate', 'DESC'], ['startTime', 'DESC']],
    });

    return {
      rows: rows.map((r) => AppointmentDatabaseMapper.toDomain(r)),
      count,
    };
  }

  async findConflicting(
    professionalId: string,
    scheduledDate: Date,
    startTime: string,
    endTime: string,
    excludeId?: string,
  ): Promise<Appointment | null> {
    const where: Record<string, unknown> = {
      professionalId,
      scheduledDate,
      status: {
        [Op.notIn]: [AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW],
      },
      [Op.and]: [
        { startTime: { [Op.lt]: endTime } },
        { endTime: { [Op.gt]: startTime } },
      ],
    };

    if (excludeId) {
      where.id = { [Op.ne]: excludeId };
    }

    const model = await AppointmentModel.findOne({ where });
    return model ? AppointmentDatabaseMapper.toDomain(model) : null;
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<{ rows: Appointment[]; count: number }> {
    const offset = (page - 1) * limit;
    const { rows, count } = await AppointmentModel.findAndCountAll({
      limit,
      offset,
      order: [['scheduledDate', 'DESC'], ['startTime', 'DESC']],
    });

    return {
      rows: rows.map((r) => AppointmentDatabaseMapper.toDomain(r)),
      count,
    };
  }

  async create(appointment: Appointment): Promise<Appointment> {
    const data = AppointmentDatabaseMapper.toModel(appointment);
    const model = await AppointmentModel.create(data as AppointmentModel);
    return AppointmentDatabaseMapper.toDomain(model);
  }

  async update(appointment: Appointment): Promise<Appointment> {
    const data = AppointmentDatabaseMapper.toModel(appointment);
    await AppointmentModel.update(data, { where: { id: appointment.id } });
    const updated = await AppointmentModel.findByPk(appointment.id);
    return AppointmentDatabaseMapper.toDomain(updated!);
  }
}
