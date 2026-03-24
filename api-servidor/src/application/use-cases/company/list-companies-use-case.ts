import { CompanyRepository } from '../../../domain/repositories/company-repository';
import { CompanyResponseDto } from '../../dtos/company-response-dto';
import { CompanyMapper } from '../../../infrastructure/http/mappers/company-mapper';
import { PaginatedResult } from '../../../shared/interfaces/pagination';

export class ListCompaniesUseCase {
  constructor(private companyRepository: CompanyRepository) {}

  async execute(page: number, limit: number): Promise<PaginatedResult<CompanyResponseDto>> {
    const { rows, count } = await this.companyRepository.findAll(page, limit);

    return {
      data: rows.map((row) => CompanyMapper.toResponse(row)),
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }
}
