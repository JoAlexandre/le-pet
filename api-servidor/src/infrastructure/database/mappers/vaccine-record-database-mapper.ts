import { VaccineRecord } from '../../../domain/entities/vaccine-record';
import { VaccineRecordModel } from '../models/vaccine-record-model';

export class VaccineRecordDatabaseMapper {
  static toDomain(model: VaccineRecordModel): VaccineRecord {
    return new VaccineRecord({
      id: model.id,
      animalId: model.animalId,
      professionalId: model.professionalId,
      vaccineName: model.vaccineName,
      vaccineManufacturer: model.vaccineManufacturer,
      batchNumber: model.batchNumber,
      applicationDate: new Date(model.applicationDate),
      nextDoseDate: model.nextDoseDate ? new Date(model.nextDoseDate) : null,
      notes: model.notes,
      createdAt: model.createdAt,
    });
  }

  static toModel(entity: VaccineRecord): Partial<VaccineRecordModel> {
    return {
      id: entity.id,
      animalId: entity.animalId,
      professionalId: entity.professionalId,
      vaccineName: entity.vaccineName,
      vaccineManufacturer: entity.vaccineManufacturer ?? null,
      batchNumber: entity.batchNumber ?? null,
      applicationDate: entity.applicationDate ?? null,
      nextDoseDate: entity.nextDoseDate ?? null,
      notes: entity.notes ?? null,
    };
  }
}
