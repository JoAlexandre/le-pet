import { Schedule } from '../../../domain/entities/schedule';
import { ScheduleRepository } from '../../../domain/repositories/schedule-repository';
import { ScheduleOwnerType } from '../../../domain/enums/schedule-owner-type';
import { DayOfWeek } from '../../../domain/enums/day-of-week';
import { ScheduleModel } from '../models/schedule-model';
import { ScheduleDatabaseMapper } from '../mappers/schedule-database-mapper';

export class SequelizeScheduleRepository implements ScheduleRepository {
  
  async findAll(): Promise<Schedule[]> {
    const model = await ScheduleModel.findAll();
    return model.map((m) => ScheduleDatabaseMapper.toDomain(m));
  }

  async findById(id: string): Promise<Schedule | null> {
    const model = await ScheduleModel.findByPk(id);
    return model ? ScheduleDatabaseMapper.toDomain(model) : null;
  }

  async findByOwner(
    ownerId: string,
    ownerType: ScheduleOwnerType,
  ): Promise<Schedule[]> {
    const models = await ScheduleModel.findAll({
      where: { ownerId, ownerType },
      order: [['dayOfWeek', 'ASC'], ['startTime', 'ASC']],
    });
    return models.map((m) => ScheduleDatabaseMapper.toDomain(m));
  }

  async findByOwnerAndDay(
    ownerId: string,
    ownerType: ScheduleOwnerType,
    dayOfWeek: DayOfWeek,
  ): Promise<Schedule[]> {
    const models = await ScheduleModel.findAll({
      where: { ownerId, ownerType, dayOfWeek },
      order: [['startTime', 'ASC']],
    });
    return models.map((m) => ScheduleDatabaseMapper.toDomain(m));
  }

  async create(schedule: Schedule): Promise<Schedule> {
    const data = ScheduleDatabaseMapper.toModel(schedule);
    const model = await ScheduleModel.create(data as ScheduleModel);
    return ScheduleDatabaseMapper.toDomain(model);
  }

  async update(schedule: Schedule): Promise<Schedule> {
    const data = ScheduleDatabaseMapper.toModel(schedule);
    await ScheduleModel.update(data, { where: { id: schedule.id } });
    const updated = await ScheduleModel.findByPk(schedule.id);
    return ScheduleDatabaseMapper.toDomain(updated!);
  }

  async delete(id: string): Promise<void> {
    await ScheduleModel.destroy({ where: { id } });
  }
}
