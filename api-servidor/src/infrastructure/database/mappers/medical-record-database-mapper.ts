import { MedicalRecord } from '../../../domain/entities/medical-record';
import { MedicalRecordType } from '../../../domain/enums/medical-record-type';
import { MedicalRecordModel } from '../models/medical-record-model';

export class MedicalRecordDatabaseMapper {
  static toDomain(model: MedicalRecordModel): MedicalRecord {
    return new MedicalRecord({
      id: model.id,
      animalId: model.animalId,
      professionalId: model.professionalId,
      type: model.type as MedicalRecordType,
      title: model.title,
      description: model.description,
      diagnosis: model.diagnosis,
      medications: model.medications,
      dosage: model.dosage,
      treatmentNotes: model.treatmentNotes,
      reason: model.reason,
      anamnesis: model.anamnesis,
      physicalExam: model.physicalExam,
      vitalSigns: model.vitalSigns,
      validUntil: model.validUntil ? new Date(model.validUntil) : null,
      consentGiven: model.consentGiven,
      attachmentUrl: model.attachmentUrl,
      isActive: model.isActive,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toModel(entity: MedicalRecord): Partial<MedicalRecordModel> {
    return {
      id: entity.id,
      animalId: entity.animalId,
      professionalId: entity.professionalId,
      type: entity.type,
      title: entity.title,
      description: entity.description ?? null,
      diagnosis: entity.diagnosis ?? null,
      medications: entity.medications ?? null,
      dosage: entity.dosage ?? null,
      treatmentNotes: entity.treatmentNotes ?? null,
      reason: entity.reason ?? null,
      anamnesis: entity.anamnesis ?? null,
      physicalExam: entity.physicalExam ?? null,
      vitalSigns: entity.vitalSigns ?? null,
      validUntil: entity.validUntil ?? null,
      consentGiven: entity.consentGiven ?? null,
      attachmentUrl: entity.attachmentUrl ?? null,
      isActive: entity.isActive,
    };
  }
}
