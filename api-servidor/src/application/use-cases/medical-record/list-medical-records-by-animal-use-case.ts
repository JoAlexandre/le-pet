import { MedicalRecordRepository } from '../../../domain/repositories/medical-record-repository';
import { AnimalRepository } from '../../../domain/repositories/animal-repository';
import { MedicalRecordResponseDto } from '../../dtos/medical-record-response-dto';
import { MedicalRecordMapper } from '../../../infrastructure/http/mappers/medical-record-mapper';
import { DomainError } from '../../../shared/errors';

export class ListMedicalRecordsByAnimalUseCase {
  constructor(
    private medicalRecordRepository: MedicalRecordRepository,
    private animalRepository: AnimalRepository,
  ) {}

  async execute(
    animalId: string,
    type: string | undefined,
    page: number,
    limit: number,
  ): Promise<{
    data: MedicalRecordResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const animal = await this.animalRepository.findById(animalId);
    if (!animal) {
      throw new DomainError('Animal not found', 404);
    }

    const result = type
      ? await this.medicalRecordRepository.findByAnimalIdAndType(animalId, type, page, limit)
      : await this.medicalRecordRepository.findByAnimalId(animalId, page, limit);

    return {
      data: result.rows.map((r) => MedicalRecordMapper.toResponse(r)),
      total: result.count,
      page,
      limit,
      totalPages: Math.ceil(result.count / limit),
    };
  }
}
