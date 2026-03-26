import { Service } from '../../../domain/entities/service';
import { ServiceCategory } from '../../../domain/enums/service-category';
import { ServiceModel } from '../models/service-model';

export class ServiceDatabaseMapper {
  static toDomain(model: ServiceModel): Service {
    return new Service({
      id: model.id,
      companyId: model.companyId,
      professionalId: model.professionalId,
      name: model.name,
      description: model.description,
      category: model.category as ServiceCategory,
      price: Number(model.price),
      durationMinutes: model.durationMinutes,
      isActive: model.isActive,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      deletedAt: model.deletedAt,
    });
  }

  static toModel(entity: Service): Partial<ServiceModel> {
    return {
      id: entity.id,
      companyId: entity.companyId ?? null,
      professionalId: entity.professionalId ?? null,
      name: entity.name,
      description: entity.description ?? null,
      category: entity.category,
      price: entity.price,
      durationMinutes: entity.durationMinutes ?? null,
      isActive: entity.isActive,
    };
  }
}
