import { CompanyRepository } from '../../../domain/repositories/company-repository';
import { Company } from '../../../domain/entities/company';
import { Cnpj } from '../../../domain/value-objects/cnpj';
import { CompanyAlreadyExistsError } from '../../../domain/errors/company-already-exists-error';
import { CreateCompanyDto } from '../../dtos/create-company-dto';
import { CompanyResponseDto } from '../../dtos/company-response-dto';
import { CompanyMapper } from '../../../infrastructure/http/mappers/company-mapper';

export class CreateCompanyUseCase {
  constructor(private companyRepository: CompanyRepository) {}

  async execute(userId: string, dto: CreateCompanyDto): Promise<CompanyResponseDto> {
    // Verifica se o usuario ja possui uma empresa
    const existing = await this.companyRepository.findByCNPJ(dto.cnpj);
    if (existing) {
      throw new CompanyAlreadyExistsError();
    }

    // Valida CNPJ se fornecido
    if (dto.cnpj) {
      new Cnpj(dto.cnpj);
    }

    const company = new Company({
      userId,
      tradeName: dto.tradeName,
      legalName: dto.legalName,
      cnpj: dto.cnpj ? dto.cnpj.replace(/\D/g, '') : null,
      phone: dto.phone,
      address: dto.address,
      city: dto.city,
      state: dto.state,
      description: dto.description || null,
      logoUrl: dto.logoUrl || null,
      isActive: true,
    });

    const created = await this.companyRepository.create(company);
    return CompanyMapper.toResponse(created);
  }
}
