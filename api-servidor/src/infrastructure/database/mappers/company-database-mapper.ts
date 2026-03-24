import { Company } from '../../../domain/entities/company';
import { CompanyModel } from '../models/company-model';

export class CompanyDatabaseMapper {
  static toDomain(model: CompanyModel): Company {
    return new Company({
      id: model.id,
      userId: model.userId,
      tradeName: model.tradeName,
      legalName: model.legalName,
      cnpj: model.cnpj,
      phone: model.phone,
      address: model.address,
      city: model.city,
      state: model.state,
      description: model.description,
      logoUrl: model.logoUrl,
      isActive: model.isActive,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      deletedAt: model.deletedAt,
    });
  }

  static toModel(entity: Company): Partial<CompanyModel> {
    return {
      id: entity.id,
      userId: entity.userId,
      tradeName: entity.tradeName,
      legalName: entity.legalName,
      cnpj: entity.cnpj ?? null,
      phone: entity.phone,
      address: entity.address,
      city: entity.city,
      state: entity.state,
      description: entity.description ?? null,
      logoUrl: entity.logoUrl ?? null,
      isActive: entity.isActive,
    };
  }
}
