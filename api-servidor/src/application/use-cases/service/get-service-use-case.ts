import { ServiceRepository } from '../../../domain/repositories/service-repository';
import { ServiceResponseDto } from '../../dtos/service-response-dto';
import { ServiceMapper } from '../../../infrastructure/http/mappers/service-mapper';
import { DomainError } from '../../../shared/errors';

export class GetServiceUseCase {
  constructor(private serviceRepository: ServiceRepository) {}

  async execute(id: string): Promise<ServiceResponseDto> {
    const service = await this.serviceRepository.findById(id);
    if (!service) {
      throw new DomainError('Service not found', 404);
    }

    return ServiceMapper.toResponse(service);
  }
}
