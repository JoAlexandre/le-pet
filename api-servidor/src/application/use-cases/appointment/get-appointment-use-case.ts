import { AppointmentRepository } from '../../../domain/repositories/appointment-repository';
import { AppointmentResponseDto } from '../../dtos/appointment-response-dto';
import { AppointmentMapper } from '../../../infrastructure/http/mappers/appointment-mapper';
import { DomainError } from '../../../shared/errors';

export class GetAppointmentUseCase {
  constructor(private appointmentRepository: AppointmentRepository) {}

  async execute(
    appointmentId: string,
    userId: string,
    role: string,
  ): Promise<AppointmentResponseDto> {
    const appointment = await this.appointmentRepository.findById(appointmentId);
    if (!appointment) {
      throw new DomainError('Appointment not found', 404);
    }

    // Verifica acesso: tutor, profissional do agendamento, ou admin
    if (role === 'ADMIN') {
      return AppointmentMapper.toResponse(appointment);
    }

    if (
      appointment.tutorId !== userId &&
      appointment.professionalId !== userId
    ) {
      throw new DomainError('Access denied: you do not have access to this appointment', 403);
    }

    return AppointmentMapper.toResponse(appointment);
  }
}
