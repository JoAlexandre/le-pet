import { Company } from '../../../domain/entities/company';
import { CompanyResponseDto } from '../../../application/dtos/company-response-dto';

export class CompanyMapper {
  static toResponse(company: Company): CompanyResponseDto {
    return {
      id: company.id!,
      userId: company.userId,
      tradeName: company.tradeName,
      legalName: company.legalName,
      cnpj: company.cnpj || null,
      phone: company.phone,
      address: company.address,
      city: company.city,
      state: company.state,
      description: company.description || null,
      logoUrl: company.logoUrl || null,
      isActive: company.isActive,
      createdAt: company.createdAt!,
      updatedAt: company.updatedAt!,
    };
  }
}
