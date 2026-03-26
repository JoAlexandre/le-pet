import { Appointment } from '../../../domain/entities/appointment';
import { AppointmentResponseDto } from '../../../application/dtos/appointment-response-dto';

export class AppointmentMapper {
  static toResponse(appointment: Appointment): AppointmentResponseDto {
    let scheduledDate: string;
    if (appointment.scheduledDate instanceof Date) {
      const year = appointment.scheduledDate.getFullYear();
      const month = String(appointment.scheduledDate.getMonth() + 1).padStart(2, '0');
      const day = String(appointment.scheduledDate.getDate()).padStart(2, '0');
      scheduledDate = `${year}-${month}-${day}`;
    } else {
      scheduledDate = String(appointment.scheduledDate);
    }

    return {
      id: appointment.id!,
      tutorId: appointment.tutorId,
      animalId: appointment.animalId,
      professionalId: appointment.professionalId,
      companyId: appointment.companyId || null,
      serviceId: appointment.serviceId,
      scheduledDate,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      status: appointment.status,
      notes: appointment.notes || null,
      cancellationReason: appointment.cancellationReason || null,
      createdAt: appointment.createdAt!,
      updatedAt: appointment.updatedAt!,
    };
  }
}
