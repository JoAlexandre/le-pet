import { ServiceRepository } from '../../../domain/repositories/service-repository';
import { CompanyRepository } from '../../../domain/repositories/company-repository';
import { ServiceCategory } from '../../../domain/enums/service-category';
import { Role } from '../../../domain/enums/role';
import { UpdateServiceDto } from '../../dtos/update-service-dto';
import { ServiceResponseDto } from '../../dtos/service-response-dto';
import { ServiceMapper } from '../../../infrastructure/http/mappers/service-mapper';
import { DomainError } from '../../../shared/errors';

export class UpdateServiceUseCase {
  constructor(
    private serviceRepository: ServiceRepository,
    private companyRepository: CompanyRepository,
  ) {}

  async execute(
    serviceId: string,
    userId: string,
    userRole: string,
    dto: UpdateServiceDto,
  ): Promise<ServiceResponseDto> {
    const service = await this.serviceRepository.findById(serviceId);
    if (!service) {
      throw new DomainError('Service not found', 404);
    }

    // Verificacao de ownership baseada no tipo do servico
    if (userRole === Role.COMPANY) {
      const company = await this.companyRepository.findByUserId(userId);
      if (!company || company.id !== service.companyId) {
        throw new DomainError('Access denied: you are not the owner of this service', 403);
      }
    } else if (userRole === Role.PROFESSIONAL) {
      if (service.professionalId !== userId) {
        throw new DomainError('Access denied: you are not the owner of this service', 403);
      }
    } else if (userRole !== Role.ADMIN) {
      throw new DomainError('Access denied: insufficient permissions', 403);
    }

    if (dto.category !== undefined) {
      if (!Object.values(ServiceCategory).includes(dto.category as ServiceCategory)) {
        throw new DomainError(
          `Invalid category. Must be one of: ${Object.values(ServiceCategory).join(', ')}`,
          400,
        );
      }
      service.category = dto.category as ServiceCategory;
    }

    if (dto.price !== undefined) {
      if (dto.price < 0) {
        throw new DomainError('Price must be a positive value', 400);
      }
      service.price = dto.price;
    }

    if (dto.durationMinutes !== undefined) {
      if (dto.durationMinutes <= 0) {
        throw new DomainError('Duration must be a positive value', 400);
      }
      service.durationMinutes = dto.durationMinutes;
    }

    if (dto.name !== undefined) {
      service.name = dto.name;
    }
    if (dto.description !== undefined) {
      service.description = dto.description || null;
    }
    if (dto.isActive !== undefined) {
      service.isActive = dto.isActive;
    }

    const updated = await this.serviceRepository.update(service);
    return ServiceMapper.toResponse(updated);
  }
}
