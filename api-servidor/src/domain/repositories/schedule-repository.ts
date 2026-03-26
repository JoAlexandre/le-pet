import { Schedule } from '../entities/schedule';
import { ScheduleOwnerType } from '../enums/schedule-owner-type';
import { DayOfWeek } from '../enums/day-of-week';

export interface ScheduleRepository {
  findById(id: string): Promise<Schedule | null>;
  findAll(): Promise<Schedule[]>;
  findByOwner(
    ownerId: string,
    ownerType: ScheduleOwnerType,
  ): Promise<Schedule[]>;
  findByOwnerAndDay(
    ownerId: string,
    ownerType: ScheduleOwnerType,
    dayOfWeek: DayOfWeek,
  ): Promise<Schedule[]>;
  create(schedule: Schedule): Promise<Schedule>;
  update(schedule: Schedule): Promise<Schedule>;
  delete(id: string): Promise<void>;
}
