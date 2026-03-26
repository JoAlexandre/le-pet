import { ScheduleRepository } from '../../../domain/repositories/schedule-repository';
import { CompanyRepository } from '../../../domain/repositories/company-repository';
import { ScheduleOwnerType } from '../../../domain/enums/schedule-owner-type';
import { DomainError } from '../../../shared/errors';

export class DeleteScheduleUseCase {
  constructor(
    private scheduleRepository: ScheduleRepository,
    private companyRepository: CompanyRepository,
  ) {}

  async execute(scheduleId: string, userId: string, role: string): Promise<void> {
    const schedule = await this.scheduleRepository.findById(scheduleId);
    if (!schedule) {
      throw new DomainError('Schedule not found', 404);
    }

    // ADMIN tem acesso total
    if (role === 'ADMIN') {
      // Admin pode deletar qualquer calendario
    } else if (role === 'COMPANY') {
      const company = await this.companyRepository.findByUserId(userId);
      if (!company || company.id !== schedule.ownerId) {
        throw new DomainError('Access denied: you are not the owner of this schedule', 403);
      }
    } else if (role === 'PROFESSIONAL') {
      if (schedule.ownerType !== ScheduleOwnerType.PROFESSIONAL || schedule.ownerId !== userId) {
        throw new DomainError('Access denied: you are not the owner of this schedule', 403);
      }
    } else {
      throw new DomainError('Only ADMIN, COMPANY or PROFESSIONAL roles can delete schedules', 403);
    }

    await this.scheduleRepository.delete(scheduleId);
  }
}
