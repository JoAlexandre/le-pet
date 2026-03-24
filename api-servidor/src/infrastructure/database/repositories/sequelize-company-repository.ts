import { Company } from '../../../domain/entities/company';
import { CompanyRepository } from '../../../domain/repositories/company-repository';
import { CompanyModel } from '../models/company-model';
import { CompanyDatabaseMapper } from '../mappers/company-database-mapper';

export class SequelizeCompanyRepository implements CompanyRepository {
  async findById(id: string): Promise<Company | null> {
    const model = await CompanyModel.findByPk(id);
    return model ? CompanyDatabaseMapper.toDomain(model) : null;
  }

  async findByCNPJ(cnpj: string): Promise<Company | null> {
    const model = await CompanyModel.findOne({ where: { cnpj } });
    return model ? CompanyDatabaseMapper.toDomain(model) : null;
  }

  async findByUserId(userId: string): Promise<Company | null> {
    const model = await CompanyModel.findOne({ where: { userId } });
    return model ? CompanyDatabaseMapper.toDomain(model) : null;
  }

  async findAll(page: number, limit: number): Promise<{ rows: Company[]; count: number }> {
    const offset = (page - 1) * limit;
    const { rows, count } = await CompanyModel.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      rows: rows.map((row) => CompanyDatabaseMapper.toDomain(row)),
      count,
    };
  }

  async create(company: Company): Promise<Company> {
    const data = CompanyDatabaseMapper.toModel(company);
    const model = await CompanyModel.create(data as CompanyModel);
    return CompanyDatabaseMapper.toDomain(model);
  }

  async update(company: Company): Promise<Company> {
    const data = CompanyDatabaseMapper.toModel(company);
    await CompanyModel.update(data, { where: { id: company.id } });
    const updated = await CompanyModel.findByPk(company.id);
    return CompanyDatabaseMapper.toDomain(updated!);
  }

  async softDelete(id: string): Promise<void> {
    await CompanyModel.destroy({ where: { id } });
  }
}
