export interface AppointmentResponseDto {
  id: string;
  tutorId: string;
  animalId: string;
  professionalId: string;
  companyId: string | null;
  serviceId: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  status: string;
  notes: string | null;
  cancellationReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}
