import { Service } from '../../../domain/entities/service';
import { ServiceRepository } from '../../../domain/repositories/service-repository';
import { ServiceModel } from '../models/service-model';
import { ServiceDatabaseMapper } from '../mappers/service-database-mapper';

export class SequelizeServiceRepository implements ServiceRepository {
  async findById(id: string): Promise<Service | null> {
    const model = await ServiceModel.findByPk(id);
    return model ? ServiceDatabaseMapper.toDomain(model) : null;
  }

  async findByCompanyId(
    companyId: string,
    page: number,
    limit: number,
  ): Promise<{ rows: Service[]; count: number }> {
    const offset = (page - 1) * limit;
    const { rows, count } = await ServiceModel.findAndCountAll({
      where: { companyId },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      rows: rows.map((row) => ServiceDatabaseMapper.toDomain(row)),
      count,
    };
  }

  async findByProfessionalId(
    professionalId: string,
    page: number,
    limit: number,
  ): Promise<{ rows: Service[]; count: number }> {
    const offset = (page - 1) * limit;
    const { rows, count } = await ServiceModel.findAndCountAll({
      where: { professionalId },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      rows: rows.map((row) => ServiceDatabaseMapper.toDomain(row)),
      count,
    };
  }

  async findAll(page: number, limit: number): Promise<{ rows: Service[]; count: number }> {
    const offset = (page - 1) * limit;
    const { rows, count } = await ServiceModel.findAndCountAll({
      where: { isActive: true },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      rows: rows.map((row) => ServiceDatabaseMapper.toDomain(row)),
      count,
    };
  }

  async create(service: Service): Promise<Service> {
    const data = ServiceDatabaseMapper.toModel(service);
    const model = await ServiceModel.create(data as ServiceModel);
    return ServiceDatabaseMapper.toDomain(model);
  }

  async update(service: Service): Promise<Service> {
    const data = ServiceDatabaseMapper.toModel(service);
    await ServiceModel.update(data, { where: { id: service.id } });
    const updated = await ServiceModel.findByPk(service.id);
    return ServiceDatabaseMapper.toDomain(updated!);
  }

  async softDelete(id: string): Promise<void> {
    await ServiceModel.destroy({ where: { id } });
  }
}
