import { ScheduleRepository } from '../../../domain/repositories/schedule-repository';
import { ScheduleOwnerType } from '../../../domain/enums/schedule-owner-type';
import { ScheduleResponseDto } from '../../dtos/schedule-response-dto';
import { ScheduleMapper } from '../../../infrastructure/http/mappers/schedule-mapper';
import { DomainError } from '../../../shared/errors';
import { CompanyRepository } from '../../../domain/repositories/company-repository';

export class GetCompanyScheduleUseCase {
  constructor(
    private scheduleRepository: ScheduleRepository,
    private companyRepository: CompanyRepository,
  ) {}

  async execute(companyId: string): Promise<ScheduleResponseDto[]> {
    const company = await this.companyRepository.findById(companyId);
    if (!company) {
      throw new DomainError('Company not found', 404);
    }

    const schedules = await this.scheduleRepository.findByOwner(
      companyId,
      ScheduleOwnerType.COMPANY,
    );

    return schedules
      .filter((s) => s.isActive)
      .map((s) => ScheduleMapper.toResponse(s));
  }
}
