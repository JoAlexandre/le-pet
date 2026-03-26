import { AppointmentRepository } from '../../../domain/repositories/appointment-repository';
import { AppointmentStatus } from '../../../domain/enums/appointment-status';
import { AppointmentResponseDto } from '../../dtos/appointment-response-dto';
import { AppointmentMapper } from '../../../infrastructure/http/mappers/appointment-mapper';
import { DomainError } from '../../../shared/errors';

export class CancelAppointmentUseCase {
  constructor(private appointmentRepository: AppointmentRepository) {}

  async execute(
    appointmentId: string,
    userId: string,
    role: string,
    cancellationReason?: string,
  ): Promise<AppointmentResponseDto> {
    const appointment = await this.appointmentRepository.findById(appointmentId);
    if (!appointment) {
      throw new DomainError('Appointment not found', 404);
    }

    // Admin, tutor ou profissional podem cancelar
    if (
      role !== 'ADMIN' &&
      appointment.tutorId !== userId &&
      appointment.professionalId !== userId
    ) {
      throw new DomainError('Access denied: you do not have access to this appointment', 403);
    }

    const cancellableStatuses = [
      AppointmentStatus.PENDING,
      AppointmentStatus.CONFIRMED,
      AppointmentStatus.IN_PROGRESS,
    ];

    if (!cancellableStatuses.includes(appointment.status)) {
      throw new DomainError(
        `Cannot cancel an appointment with status ${appointment.status}`,
        400,
      );
    }

    appointment.status = AppointmentStatus.CANCELLED;
    appointment.cancellationReason = cancellationReason || null;

    const updated = await this.appointmentRepository.update(appointment);
    return AppointmentMapper.toResponse(updated);
  }
}
