import { CompanyRepository } from '../../../domain/repositories/company-repository';
import { CompanyResponseDto } from '../../dtos/company-response-dto';
import { CompanyMapper } from '../../../infrastructure/http/mappers/company-mapper';
import { DomainError } from '../../../shared/errors';

export class GetCompanyUseCase {
  constructor(private companyRepository: CompanyRepository) {}

  async execute(id: string): Promise<CompanyResponseDto> {
    const company = await this.companyRepository.findById(id);
    if (!company) {
      throw new DomainError('Company not found', 404);
    }

    return CompanyMapper.toResponse(company);
  }
}
