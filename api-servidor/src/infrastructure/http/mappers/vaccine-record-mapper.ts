import { VaccineRecord } from '../../../domain/entities/vaccine-record';
import { VaccineRecordResponseDto } from '../../../application/dtos/vaccine-record-response-dto';

export class VaccineRecordMapper {
  static toResponse(vaccineRecord: VaccineRecord): VaccineRecordResponseDto {
    return {
      id: vaccineRecord.id!,
      animalId: vaccineRecord.animalId,
      professionalId: vaccineRecord.professionalId,
      vaccineName: vaccineRecord.vaccineName,
      vaccineManufacturer: vaccineRecord.vaccineManufacturer || null,
      batchNumber: vaccineRecord.batchNumber || null,
      applicationDate: vaccineRecord.applicationDate,
      nextDoseDate: vaccineRecord.nextDoseDate || null,
      notes: vaccineRecord.notes || null,
      createdAt: vaccineRecord.createdAt!,
    };
  }
}
