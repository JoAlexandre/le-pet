import { Service } from '../../../domain/entities/service';
import { ServiceResponseDto } from '../../../application/dtos/service-response-dto';

export class ServiceMapper {
  static toResponse(service: Service): ServiceResponseDto {
    return {
      id: service.id!,
      companyId: service.companyId ?? null,
      professionalId: service.professionalId ?? null,
      name: service.name,
      description: service.description || null,
      category: service.category,
      price: service.price,
      durationMinutes: service.durationMinutes ?? null,
      isActive: service.isActive,
      createdAt: service.createdAt!,
      updatedAt: service.updatedAt!,
    };
  }
}
