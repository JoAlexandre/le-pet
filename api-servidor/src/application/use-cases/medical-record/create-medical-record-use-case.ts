import { MedicalRecordRepository } from '../../../domain/repositories/medical-record-repository';
import { AnimalRepository } from '../../../domain/repositories/animal-repository';
import { MedicalRecord } from '../../../domain/entities/medical-record';
import { MedicalRecordType } from '../../../domain/enums/medical-record-type';
import { Role } from '../../../domain/enums/role';
import { CreateMedicalRecordDto } from '../../dtos/create-medical-record-dto';
import { MedicalRecordResponseDto } from '../../dtos/medical-record-response-dto';
import { MedicalRecordMapper } from '../../../infrastructure/http/mappers/medical-record-mapper';
import { DomainError } from '../../../shared/errors';
import { QuotaService } from '../../../domain/services/quota-service';

export class CreateMedicalRecordUseCase {
  constructor(
    private medicalRecordRepository: MedicalRecordRepository,
    private animalRepository: AnimalRepository,
    private quotaService: QuotaService,
  ) {}

  async execute(
    animalId: string,
    professionalId: string,
    userRole: string,
    dto: CreateMedicalRecordDto,
  ): Promise<MedicalRecordResponseDto> {
    const animal = await this.animalRepository.findById(animalId);
    if (!animal) {
      throw new DomainError('Animal not found', 404);
    }

    // Verificacao de quota de prontuarios por mes pelo plano do usuario
    const now = new Date();
    const monthCount = await this.medicalRecordRepository.countByProfessionalIdInMonth(
      professionalId,
      now.getFullYear(),
      now.getMonth() + 1,
    );
    await this.quotaService.checkQuota(
      professionalId,
      userRole as Role,
      'maxMedicalRecordsPerMonth',
      monthCount,
    );

    const validTypes = Object.values(MedicalRecordType);
    if (!validTypes.includes(dto.type as MedicalRecordType)) {
      throw new DomainError(
        `Invalid medical record type. Valid types: ${validTypes.join(', ')}`,
        400,
      );
    }

    const medicalRecord = new MedicalRecord({
      animalId,
      professionalId,
      type: dto.type as MedicalRecordType,
      title: dto.title,
      description: dto.description || null,
      diagnosis: dto.diagnosis || null,
      medications: dto.medications || null,
      dosage: dto.dosage || null,
      treatmentNotes: dto.treatmentNotes || null,
      reason: dto.reason || null,
      anamnesis: dto.anamnesis || null,
      physicalExam: dto.physicalExam || null,
      vitalSigns: dto.vitalSigns || null,
      validUntil: dto.validUntil ? new Date(dto.validUntil) : null,
      consentGiven: dto.consentGiven ?? null,
      isActive: true,
    });

    const created = await this.medicalRecordRepository.create(medicalRecord);
    return MedicalRecordMapper.toResponse(created);
  }
}
