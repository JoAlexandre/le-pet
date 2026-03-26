import { Schedule } from '../../../domain/entities/schedule';
import { DayOfWeek } from '../../../domain/enums/day-of-week';
import { ScheduleOwnerType } from '../../../domain/enums/schedule-owner-type';
import { ScheduleModel } from '../models/schedule-model';

export class ScheduleDatabaseMapper {
  static toDomain(model: ScheduleModel): Schedule {
    return new Schedule({
      id: model.id,
      ownerId: model.ownerId,
      ownerType: model.ownerType as ScheduleOwnerType,
      dayOfWeek: model.dayOfWeek as DayOfWeek,
      startTime: model.startTime,
      endTime: model.endTime,
      isActive: model.isActive,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toModel(entity: Schedule): Partial<ScheduleModel> {
    return {
      id: entity.id,
      ownerId: entity.ownerId,
      ownerType: entity.ownerType,
      dayOfWeek: entity.dayOfWeek,
      startTime: entity.startTime,
      endTime: entity.endTime,
      isActive: entity.isActive,
    };
  }
}
