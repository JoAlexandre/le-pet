import { VaccineRecordRepository } from '../../../domain/repositories/vaccine-record-repository';
import { AnimalRepository } from '../../../domain/repositories/animal-repository';
import { VaccineRecord } from '../../../domain/entities/vaccine-record';
import { CreateVaccineRecordDto } from '../../dtos/create-vaccine-record-dto';
import { VaccineRecordResponseDto } from '../../dtos/vaccine-record-response-dto';
import { VaccineRecordMapper } from '../../../infrastructure/http/mappers/vaccine-record-mapper';
import { DomainError } from '../../../shared/errors';

export class RegisterVaccineUseCase {
  constructor(
    private vaccineRecordRepository: VaccineRecordRepository,
    private animalRepository: AnimalRepository,
  ) {}

  async execute(
    animalId: string,
    professionalId: string,
    dto: CreateVaccineRecordDto,
  ): Promise<VaccineRecordResponseDto> {
    // Verificar se o animal existe
    const animal = await this.animalRepository.findById(animalId);
    if (!animal) {
      throw new DomainError('Animal not found', 404);
    }

    // Validar data de aplicacao
    const applicationDate = new Date(dto.applicationDate);
    if (isNaN(applicationDate.getTime())) {
      throw new DomainError('Invalid application date format', 400);
    }

    // Validar data da proxima dose (se fornecida)
    let nextDoseDate: Date | null = null;
    if (dto.nextDoseDate) {
      nextDoseDate = new Date(dto.nextDoseDate);
      if (isNaN(nextDoseDate.getTime())) {
        throw new DomainError('Invalid next dose date format', 400);
      }
      if (nextDoseDate <= applicationDate) {
        throw new DomainError('Next dose date must be after application date', 400);
      }
    }

    const vaccineRecord = new VaccineRecord({
      animalId,
      professionalId,
      vaccineName: dto.vaccineName,
      vaccineManufacturer: dto.vaccineManufacturer || null,
      batchNumber: dto.batchNumber || null,
      applicationDate,
      nextDoseDate,
      notes: dto.notes || null,
    });

    const created = await this.vaccineRecordRepository.create(vaccineRecord);
    return VaccineRecordMapper.toResponse(created);
  }
}
