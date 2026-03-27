import { MedicalRecordRepository } from '../../../domain/repositories/medical-record-repository';
import { UpdateMedicalRecordDto } from '../../dtos/update-medical-record-dto';
import { MedicalRecordResponseDto } from '../../dtos/medical-record-response-dto';
import { MedicalRecordMapper } from '../../../infrastructure/http/mappers/medical-record-mapper';
import { MedicalRecordNotFoundError } from '../../../domain/errors/medical-record-not-found-error';
import { DomainError } from '../../../shared/errors';

export class UpdateMedicalRecordUseCase {
  constructor(private medicalRecordRepository: MedicalRecordRepository) {}

  async execute(
    id: string,
    professionalId: string,
    dto: UpdateMedicalRecordDto,
  ): Promise<MedicalRecordResponseDto> {
    const record = await this.medicalRecordRepository.findById(id);
    if (!record) {
      throw new MedicalRecordNotFoundError();
    }

    if (record.professionalId !== professionalId) {
      throw new DomainError('Only the author can update this medical record', 403);
    }

    if (dto.title !== undefined) record.title = dto.title;
    if (dto.description !== undefined) record.description = dto.description || null;
    if (dto.diagnosis !== undefined) record.diagnosis = dto.diagnosis || null;
    if (dto.medications !== undefined) record.medications = dto.medications || null;
    if (dto.dosage !== undefined) record.dosage = dto.dosage || null;
    if (dto.treatmentNotes !== undefined) record.treatmentNotes = dto.treatmentNotes || null;
    if (dto.reason !== undefined) record.reason = dto.reason || null;
    if (dto.anamnesis !== undefined) record.anamnesis = dto.anamnesis || null;
    if (dto.physicalExam !== undefined) record.physicalExam = dto.physicalExam || null;
    if (dto.vitalSigns !== undefined) record.vitalSigns = dto.vitalSigns || null;
    if (dto.validUntil !== undefined) record.validUntil = dto.validUntil ? new Date(dto.validUntil) : null;
    if (dto.consentGiven !== undefined) record.consentGiven = dto.consentGiven ?? null;

    const updated = await this.medicalRecordRepository.update(record);
    return MedicalRecordMapper.toResponse(updated);
  }
}
