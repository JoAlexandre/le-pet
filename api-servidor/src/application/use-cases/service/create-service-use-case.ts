import { ServiceRepository } from '../../../domain/repositories/service-repository';
import { CompanyRepository } from '../../../domain/repositories/company-repository';
import { UserRepository } from '../../../domain/repositories/user-repository';
import { Service } from '../../../domain/entities/service';
import { ServiceCategory } from '../../../domain/enums/service-category';
import { Role } from '../../../domain/enums/role';
import { CreateServiceDto } from '../../dtos/create-service-dto';
import { ServiceResponseDto } from '../../dtos/service-response-dto';
import { ServiceMapper } from '../../../infrastructure/http/mappers/service-mapper';
import { DomainError } from '../../../shared/errors';
import { QuotaService } from '../../../domain/services/quota-service';

export class CreateServiceUseCase {
  constructor(
    private serviceRepository: ServiceRepository,
    private companyRepository: CompanyRepository,
    private userRepository: UserRepository,
    private quotaService: QuotaService,
  ) {}

  async execute(
    userId: string,
    userRole: string,
    dto: CreateServiceDto,
  ): Promise<ServiceResponseDto> {
    let companyId: string | null = null;
    let professionalId: string | null = null;

    if (userRole === Role.COMPANY) {
      const company = await this.companyRepository.findByUserId(userId);
      if (!company) {
        throw new DomainError('Company not found for this user', 404);
      }
      companyId = company.id!;
    } else if ([Role.PROFESSIONAL, Role.ADMIN].includes(userRole as Role)) {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new DomainError('Professional not found', 404);
      }
      professionalId = user.id!;
    } else if (userRole !== Role.ADMIN) {
      throw new DomainError('Access denied: insufficient permissions', 403);
    }

    // Verificacao de quota de servicos pelo plano do usuario
    let serviceCount = 0;
    if (companyId) {
      serviceCount = (await this.serviceRepository.findByCompanyId(companyId, 1, 1)).count;
    } else if (professionalId) {
      serviceCount =
        (await this.serviceRepository.findByProfessionalId(professionalId, 1, 1)).count;
    }
    await this.quotaService.checkQuota(userId, userRole as Role, 'maxServices', serviceCount);

    if (!Object.values(ServiceCategory).includes(dto.category as ServiceCategory)) {
      throw new DomainError(
        `Invalid category. Must be one of: ${Object.values(ServiceCategory).join(', ')}`,
        400,
      );
    }

    if (dto.price < 0) {
      throw new DomainError('Price must be a positive value', 400);
    }

    if (dto.durationMinutes !== undefined && dto.durationMinutes <= 0) {
      throw new DomainError('Duration must be a positive value', 400);
    }

    const service = new Service({
      companyId: companyId,
      professionalId,
      name: dto.name,
      description: dto.description || null,
      category: dto.category as ServiceCategory,
      price: dto.price,
      durationMinutes: dto.durationMinutes ?? null,
      isActive: true,
    });

    const created = await this.serviceRepository.create(service);
    return ServiceMapper.toResponse(created);
  }
}
