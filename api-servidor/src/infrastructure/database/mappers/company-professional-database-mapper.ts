import { CompanyProfessional } from '../../../domain/entities/company-professional';
import { CompanyProfessionalModel } from '../models/company-professional-model';

export class CompanyProfessionalDatabaseMapper {
  static toDomain(model: CompanyProfessionalModel): CompanyProfessional {
    return new CompanyProfessional({
      id: model.id,
      companyId: model.companyId,
      userId: model.userId,
      createdAt: model.createdAt,
      deletedAt: model.deletedAt,
    });
  }

  static toModel(entity: CompanyProfessional): Partial<CompanyProfessionalModel> {
    return {
      id: entity.id,
      companyId: entity.companyId,
      userId: entity.userId,
    };
  }
}
