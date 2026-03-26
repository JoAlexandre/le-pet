import { Appointment } from '../../../domain/entities/appointment';
import { AppointmentStatus } from '../../../domain/enums/appointment-status';
import { AppointmentModel } from '../models/appointment-model';

export class AppointmentDatabaseMapper {
  static toDomain(model: AppointmentModel): Appointment {
    return new Appointment({
      id: model.id,
      tutorId: model.tutorId,
      animalId: model.animalId,
      professionalId: model.professionalId,
      companyId: model.companyId,
      serviceId: model.serviceId,
      scheduledDate: model.scheduledDate,
      startTime: model.startTime,
      endTime: model.endTime,
      status: model.status as AppointmentStatus,
      notes: model.notes,
      cancellationReason: model.cancellationReason,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toModel(entity: Appointment): Partial<AppointmentModel> {
    return {
      id: entity.id,
      tutorId: entity.tutorId,
      animalId: entity.animalId,
      professionalId: entity.professionalId,
      companyId: entity.companyId ?? null,
      serviceId: entity.serviceId,
      scheduledDate: entity.scheduledDate,
      startTime: entity.startTime,
      endTime: entity.endTime,
      status: entity.status,
      notes: entity.notes ?? null,
      cancellationReason: entity.cancellationReason ?? null,
    };
  }
}
