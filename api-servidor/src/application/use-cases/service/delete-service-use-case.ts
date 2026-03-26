import { ServiceRepository } from '../../../domain/repositories/service-repository';
import { CompanyRepository } from '../../../domain/repositories/company-repository';
import { Role } from '../../../domain/enums/role';
import { DomainError } from '../../../shared/errors';

export class DeleteServiceUseCase {
  constructor(
    private serviceRepository: ServiceRepository,
    private companyRepository: CompanyRepository,
  ) {}

  async execute(serviceId: string, userId: string, userRole: string): Promise<void> {
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

    await this.serviceRepository.softDelete(serviceId);
  }
}
