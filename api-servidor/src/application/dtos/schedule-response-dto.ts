export interface ScheduleResponseDto {
  id: string;
  ownerId: string;
  ownerType: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
