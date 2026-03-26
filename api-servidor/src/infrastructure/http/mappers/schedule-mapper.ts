import { Schedule } from '../../../domain/entities/schedule';
import { ScheduleResponseDto } from '../../../application/dtos/schedule-response-dto';

export class ScheduleMapper {
  static toResponse(schedule: Schedule): ScheduleResponseDto {
    return {
      id: schedule.id!,
      ownerId: schedule.ownerId,
      ownerType: schedule.ownerType,
      dayOfWeek: schedule.dayOfWeek,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      isActive: schedule.isActive,
      createdAt: schedule.createdAt!,
      updatedAt: schedule.updatedAt!,
    };
  }
}
