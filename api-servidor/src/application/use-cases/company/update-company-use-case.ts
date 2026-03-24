import { CompanyRepository } from '../../../domain/repositories/company-repository';
import { Cnpj } from '../../../domain/value-objects/cnpj';
import { UpdateCompanyDto } from '../../dtos/update-company-dto';
import { CompanyResponseDto } from '../../dtos/company-response-dto';
import { CompanyMapper } from '../../../infrastructure/http/mappers/company-mapper';
import { DomainError } from '../../../shared/errors';

export class UpdateCompanyUseCase {
  constructor(private companyRepository: CompanyRepository) {}

  async execute(
    companyId: string,
    userId: string,
    dto: UpdateCompanyDto,
  ): Promise<CompanyResponseDto> {
    const company = await this.companyRepository.findById(companyId);
    if (!company) {
      throw new DomainError('Company not found', 404);
    }

    // Somente o dono pode atualizar
    if (company.userId !== userId) {
      throw new DomainError('Access denied: you are not the owner of this company', 403);
    }

    // Valida CNPJ se fornecido
    if (dto.cnpj) {
      new Cnpj(dto.cnpj);
      company.cnpj = dto.cnpj.replace(/\D/g, '');
    }

    if (dto.tradeName !== undefined) {
      company.tradeName = dto.tradeName;
    }
    if (dto.legalName !== undefined) {
      company.legalName = dto.legalName;
    }
    if (dto.phone !== undefined) {
      company.phone = dto.phone;
    }
    if (dto.address !== undefined) {
      company.address = dto.address;
    }
    if (dto.city !== undefined) {
      company.city = dto.city;
    }
    if (dto.state !== undefined) {
      company.state = dto.state;
    }
    if (dto.description !== undefined) {
      company.description = dto.description || null;
    }
    if (dto.logoUrl !== undefined) {
      company.logoUrl = dto.logoUrl || null;
    }

    const updated = await this.companyRepository.update(company);
    return CompanyMapper.toResponse(updated);
  }
}
