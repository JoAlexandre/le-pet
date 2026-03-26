import { ScheduleRepository } from '../../../domain/repositories/schedule-repository';
import { CompanyProfessionalRepository } from '../../../domain/repositories/company-professional-repository';
import { ScheduleOwnerType } from '../../../domain/enums/schedule-owner-type';
import { ScheduleResponseDto } from '../../dtos/schedule-response-dto';
import { ScheduleMapper } from '../../../infrastructure/http/mappers/schedule-mapper';
import { DomainError } from '../../../shared/errors';

export class GetProfessionalScheduleUseCase {
  constructor(
    private scheduleRepository: ScheduleRepository,
    private companyProfessionalRepository: CompanyProfessionalRepository,
  ) {}

  async execute(professionalId: string): Promise<ScheduleResponseDto[]> {
    // Verifica se o profissional pertence a uma empresa
    const associations = await this.companyProfessionalRepository.findByUserId(professionalId);

    if (associations.length > 0) {
      // Profissional vinculado a empresa - retorna horarios da empresa
      const companyId = associations[0].companyId;
      const schedules = await this.scheduleRepository.findByOwner(
        companyId,
        ScheduleOwnerType.COMPANY,
      );
      return schedules
        .filter((s) => s.isActive)
        .map((s) => ScheduleMapper.toResponse(s));
    }

    // Profissional independente - retorna horarios proprios
    const schedules = await this.scheduleRepository.findByOwner(
      professionalId,
      ScheduleOwnerType.PROFESSIONAL,
    );

    if (schedules.length === 0) {
      throw new DomainError('No schedule found for this professional', 404);
    }

    return schedules
      .filter((s) => s.isActive)
      .map((s) => ScheduleMapper.toResponse(s));
  }
}
