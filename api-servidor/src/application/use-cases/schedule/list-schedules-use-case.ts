import { ScheduleRepository } from '../../../domain/repositories/schedule-repository';
import { CompanyRepository } from '../../../domain/repositories/company-repository';
import { ScheduleOwnerType } from '../../../domain/enums/schedule-owner-type';
import { ScheduleResponseDto } from '../../dtos/schedule-response-dto';
import { ScheduleMapper } from '../../../infrastructure/http/mappers/schedule-mapper';
import { DomainError } from '../../../shared/errors';

export class ListSchedulesUseCase {
  constructor(
    private scheduleRepository: ScheduleRepository,
    private companyRepository: CompanyRepository,
  ) {}

  async execute(userId: string, role: string): Promise<ScheduleResponseDto[]> {
    // ADMIN ve todos os calendarios
    if (role === 'ADMIN') {
      const all = await this.scheduleRepository.findAll();
      return all.map((s) => ScheduleMapper.toResponse(s));
    }

    let ownerId: string;
    let ownerType: ScheduleOwnerType;

    if (role === 'COMPANY') {
      const company = await this.companyRepository.findByUserId(userId);
      if (!company) {
        throw new DomainError('Company not found for this user', 404);
      }
      ownerId = company.id!;
      ownerType = ScheduleOwnerType.COMPANY;
    } else if (role === 'PROFESSIONAL') {
      ownerId = userId;
      ownerType = ScheduleOwnerType.PROFESSIONAL;
    } else {
      throw new DomainError('Only ADMIN, COMPANY or PROFESSIONAL roles can list schedules', 403);
    }

    const schedules = await this.scheduleRepository.findByOwner(ownerId, ownerType);
    return schedules.map((s) => ScheduleMapper.toResponse(s));
  }
}
