import { MedicalRecord } from '../../../domain/entities/medical-record';
import { MedicalRecordResponseDto } from '../../../application/dtos/medical-record-response-dto';

export class MedicalRecordMapper {
  static toResponse(record: MedicalRecord): MedicalRecordResponseDto {
    return {
      id: record.id!,
      animalId: record.animalId,
      professionalId: record.professionalId,
      type: record.type,
      title: record.title,
      description: record.description || null,
      diagnosis: record.diagnosis || null,
      medications: record.medications || null,
      dosage: record.dosage || null,
      treatmentNotes: record.treatmentNotes || null,
      reason: record.reason || null,
      anamnesis: record.anamnesis || null,
      physicalExam: record.physicalExam || null,
      vitalSigns: record.vitalSigns || null,
      validUntil: record.validUntil || null,
      consentGiven: record.consentGiven ?? null,
      attachmentUrl: record.attachmentUrl || null,
      createdAt: record.createdAt!,
      updatedAt: record.updatedAt!,
    };
  }
}
