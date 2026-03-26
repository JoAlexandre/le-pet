export interface CreateAppointmentDto {
  animalId: string;
  professionalId: string;
  serviceId: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  notes?: string;
  tutorId?: string;
}
