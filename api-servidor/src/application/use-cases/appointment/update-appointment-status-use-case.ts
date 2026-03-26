import { AppointmentRepository } from '../../../domain/repositories/appointment-repository';
import { CompanyRepository } from '../../../domain/repositories/company-repository';
import { AppointmentStatus } from '../../../domain/enums/appointment-status';
import { UpdateAppointmentStatusDto } from '../../dtos/update-appointment-status-dto';
import { AppointmentResponseDto } from '../../dtos/appointment-response-dto';
import { AppointmentMapper } from '../../../infrastructure/http/mappers/appointment-mapper';
import { DomainError } from '../../../shared/errors';

const VALID_TRANSITIONS: Record<string, string[]> = {
  [AppointmentStatus.PENDING]: [AppointmentStatus.CONFIRMED, AppointmentStatus.CANCELLED],
  [AppointmentStatus.CONFIRMED]: [
    AppointmentStatus.IN_PROGRESS,
    AppointmentStatus.CANCELLED,
    AppointmentStatus.NO_SHOW,
  ],
  [AppointmentStatus.IN_PROGRESS]: [AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED],
  [AppointmentStatus.COMPLETED]: [],
  [AppointmentStatus.CANCELLED]: [],
  [AppointmentStatus.NO_SHOW]: [],
};

export class UpdateAppointmentStatusUseCase {
  constructor(
    private appointmentRepository: AppointmentRepository,
    private companyRepository: CompanyRepository,
  ) {}

  async execute(
    appointmentId: string,
    userId: string,
    role: string,
    dto: UpdateAppointmentStatusDto,
  ): Promise<AppointmentResponseDto> {
    const appointment = await this.appointmentRepository.findById(appointmentId);
    if (!appointment) {
      throw new DomainError('Appointment not found', 404);
    }

    if (!Object.values(AppointmentStatus).includes(dto.status as AppointmentStatus)) {
      throw new DomainError(
        `Invalid status. Must be one of: ${Object.values(AppointmentStatus).join(', ')}`,
        400,
      );
    }

    // Verifica permissao
    if (role === 'TUTOR') {
      if (appointment.tutorId !== userId) {
        throw new DomainError('Access denied', 403);
      }
      // Tutor so pode cancelar
      if (dto.status !== AppointmentStatus.CANCELLED) {
        throw new DomainError('Tutors can only cancel appointments', 403);
      }
    } else if (role === 'PROFESSIONAL') {
      if (appointment.professionalId !== userId) {
        throw new DomainError('Access denied', 403);
      }
    } else if (role === 'COMPANY') {
      const company = await this.companyRepository.findByUserId(userId);
      if (!company || company.id !== appointment.companyId) {
        throw new DomainError('Access denied', 403);
      }
    } else if (role !== 'ADMIN') {
      throw new DomainError('Access denied', 403);
    }

    // Valida transicao de estado
    const allowedTransitions = VALID_TRANSITIONS[appointment.status] || [];
    if (!allowedTransitions.includes(dto.status)) {
      throw new DomainError(
        `Cannot transition from ${appointment.status} to ${dto.status}`,
        400,
      );
    }

    appointment.status = dto.status as AppointmentStatus;

    if (dto.status === AppointmentStatus.CANCELLED && dto.cancellationReason) {
      appointment.cancellationReason = dto.cancellationReason;
    }

    const updated = await this.appointmentRepository.update(appointment);
    return AppointmentMapper.toResponse(updated);
  }
}
