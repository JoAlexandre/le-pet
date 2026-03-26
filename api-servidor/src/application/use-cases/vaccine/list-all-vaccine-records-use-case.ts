import { VaccineRecordRepository } from '../../../domain/repositories/vaccine-record-repository';
import { VaccineRecordResponseDto } from '../../dtos/vaccine-record-response-dto';
import { VaccineRecordMapper } from '../../../infrastructure/http/mappers/vaccine-record-mapper';
import { PaginatedResult } from '../../../shared/interfaces/pagination';

export class ListAllVaccineRecordsUseCase {
  constructor(private vaccineRecordRepository: VaccineRecordRepository) {}

  async execute(page: number, limit: number): Promise<PaginatedResult<VaccineRecordResponseDto>> {
    const { rows, count } = await this.vaccineRecordRepository.findAll(page, limit);

    return {
      data: rows.map((row) => VaccineRecordMapper.toResponse(row)),
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }
}
