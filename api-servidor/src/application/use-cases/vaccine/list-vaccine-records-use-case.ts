import { VaccineRecordRepository } from '../../../domain/repositories/vaccine-record-repository';
import { AnimalRepository } from '../../../domain/repositories/animal-repository';
import { VaccineRecordResponseDto } from '../../dtos/vaccine-record-response-dto';
import { VaccineRecordMapper } from '../../../infrastructure/http/mappers/vaccine-record-mapper';
import { PaginatedResult } from '../../../shared/interfaces/pagination';
import { DomainError } from '../../../shared/errors';

export class ListVaccineRecordsUseCase {
  constructor(
    private vaccineRecordRepository: VaccineRecordRepository,
    private animalRepository: AnimalRepository,
  ) {}

  async execute(
    animalId: string,
    userId: string,
    userRole: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<VaccineRecordResponseDto>> {
    // Verificar se o animal existe
    const animal = await this.animalRepository.findById(animalId);
    if (!animal) {
      throw new DomainError('Animal not found', 404);
    }

    // Tutor so pode ver vacinas dos seus proprios animais
    if (userRole === 'TUTOR' && animal.tutorId !== userId) {
      throw new DomainError('Access denied: you are not the owner of this animal', 403);
    }

    const { rows, count } = await this.vaccineRecordRepository.findByAnimalId(
      animalId,
      page,
      limit,
    );

    return {
      data: rows.map((row) => VaccineRecordMapper.toResponse(row)),
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }
}
