import { DayOfWeek } from '../enums/day-of-week';
import { ScheduleOwnerType } from '../enums/schedule-owner-type';

export interface ScheduleProps {
  id?: string;
  ownerId: string;
  ownerType: ScheduleOwnerType;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Schedule {
  public readonly id?: string;
  public ownerId: string;
  public ownerType: ScheduleOwnerType;
  public dayOfWeek: DayOfWeek;
  public startTime: string;
  public endTime: string;
  public isActive: boolean;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  constructor(props: ScheduleProps) {
    this.id = props.id;
    this.ownerId = props.ownerId;
    this.ownerType = props.ownerType;
    this.dayOfWeek = props.dayOfWeek;
    this.startTime = props.startTime;
    this.endTime = props.endTime;
    this.isActive = props.isActive;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
