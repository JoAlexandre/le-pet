import { CompanyProfessional } from '../../../domain/entities/company-professional';
import { CompanyProfessionalRepository } from '../../../domain/repositories/company-professional-repository';
import { CompanyProfessionalModel } from '../models/company-professional-model';
import { CompanyProfessionalDatabaseMapper } from '../mappers/company-professional-database-mapper';

export class SequelizeCompanyProfessionalRepository implements CompanyProfessionalRepository {
  async findByCompanyAndUser(
    companyId: string,
    userId: string,
  ): Promise<CompanyProfessional | null> {
    const model = await CompanyProfessionalModel.findOne({
      where: { companyId, userId },
    });
    return model ? CompanyProfessionalDatabaseMapper.toDomain(model) : null;
  }

  async findByUserId(userId: string): Promise<CompanyProfessional[]> {
    const models = await CompanyProfessionalModel.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });
    return models.map((model) => CompanyProfessionalDatabaseMapper.toDomain(model));
  }

  async findByCompanyId(companyId: string): Promise<CompanyProfessional[]> {
    const models = await CompanyProfessionalModel.findAll({
      where: { companyId },
      order: [['createdAt', 'DESC']],
    });
    return models.map((model) => CompanyProfessionalDatabaseMapper.toDomain(model));
  }

  async create(association: CompanyProfessional): Promise<CompanyProfessional> {
    const data = CompanyProfessionalDatabaseMapper.toModel(association);
    const model = await CompanyProfessionalModel.create(data as CompanyProfessionalModel);
    return CompanyProfessionalDatabaseMapper.toDomain(model);
  }

  async delete(companyId: string, userId: string): Promise<void> {
    await CompanyProfessionalModel.destroy({
      where: { companyId, userId },
    });
  }
}
