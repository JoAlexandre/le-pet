import { Appointment } from '../entities/appointment';

export interface AppointmentRepository {
  findById(id: string): Promise<Appointment | null>;
  findByTutorId(
    tutorId: string,
    page: number,
    limit: number,
  ): Promise<{ rows: Appointment[]; count: number }>;
  findByProfessionalId(
    professionalId: string,
    page: number,
    limit: number,
  ): Promise<{ rows: Appointment[]; count: number }>;
  findByCompanyId(
    companyId: string,
    page: number,
    limit: number,
  ): Promise<{ rows: Appointment[]; count: number }>;
  findConflicting(
    professionalId: string,
    scheduledDate: Date,
    startTime: string,
    endTime: string,
    excludeId?: string,
  ): Promise<Appointment | null>;
  findAll(
    page: number,
    limit: number,
  ): Promise<{ rows: Appointment[]; count: number }>;
  create(appointment: Appointment): Promise<Appointment>;
  update(appointment: Appointment): Promise<Appointment>;
}
