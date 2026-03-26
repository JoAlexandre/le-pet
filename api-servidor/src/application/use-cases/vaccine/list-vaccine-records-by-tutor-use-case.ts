import { VaccineRecordRepository } from '../../../domain/repositories/vaccine-record-repository';
import { VaccineRecordResponseDto } from '../../dtos/vaccine-record-response-dto';
import { VaccineRecordMapper } from '../../../infrastructure/http/mappers/vaccine-record-mapper';
import { PaginatedResult } from '../../../shared/interfaces/pagination';

export class ListVaccineRecordsByTutorUseCase {
  constructor(private vaccineRecordRepository: VaccineRecordRepository) {}

  async execute(
    tutorId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<VaccineRecordResponseDto>> {
    const { rows, count } = await this.vaccineRecordRepository.findByTutorId(tutorId, page, limit);

    return {
      data: rows.map((row) => VaccineRecordMapper.toResponse(row)),
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }
}
