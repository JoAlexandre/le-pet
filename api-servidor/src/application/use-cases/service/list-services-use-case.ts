import { ServiceRepository } from '../../../domain/repositories/service-repository';
import { ServiceResponseDto } from '../../dtos/service-response-dto';
import { ServiceMapper } from '../../../infrastructure/http/mappers/service-mapper';
import { PaginatedResult } from '../../../shared/interfaces/pagination';
import { Service } from '../../../domain/entities/service';

export class ListServicesUseCase {
  constructor(private serviceRepository: ServiceRepository) {}

  async execute(
    page: number,
    limit: number,
    companyId?: string,
    professionalId?: string,
  ): Promise<PaginatedResult<ServiceResponseDto>> {
    let result: { rows: Service[]; count: number };

    if (companyId) {
      result = await this.serviceRepository.findByCompanyId(companyId, page, limit);
    } else if (professionalId) {
      result = await this.serviceRepository.findByProfessionalId(professionalId, page, limit);
    } else {
      result = await this.serviceRepository.findAll(page, limit);
    }

    const { rows, count } = result;

    return {
      data: rows.map((row) => ServiceMapper.toResponse(row)),
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }
}
