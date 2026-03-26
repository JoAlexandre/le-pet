export interface CreateScheduleDto {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  ownerId?: string;
  ownerType?: string;
}
