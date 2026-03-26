import { ScheduleRepository } from '../../../domain/repositories/schedule-repository';
import { CompanyRepository } from '../../../domain/repositories/company-repository';
import { DayOfWeek } from '../../../domain/enums/day-of-week';
import { ScheduleOwnerType } from '../../../domain/enums/schedule-owner-type';
import { UpdateScheduleDto } from '../../dtos/update-schedule-dto';
import { ScheduleResponseDto } from '../../dtos/schedule-response-dto';
import { ScheduleMapper } from '../../../infrastructure/http/mappers/schedule-mapper';
import { DomainError } from '../../../shared/errors';

export class UpdateScheduleUseCase {
  constructor(
    private scheduleRepository: ScheduleRepository,
    private companyRepository: CompanyRepository,
  ) {}

  async execute(
    scheduleId: string,
    userId: string,
    role: string,
    dto: UpdateScheduleDto,
  ): Promise<ScheduleResponseDto> {
    const schedule = await this.scheduleRepository.findById(scheduleId);
    if (!schedule) {
      throw new DomainError('Schedule not found', 404);
    }

    // Verifica permissao de dono (ADMIN tem acesso total)
    if (role === 'ADMIN') {
      // Admin pode atualizar qualquer calendario
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
      throw new DomainError('Only ADMIN, COMPANY or PROFESSIONAL roles can update schedules', 403);
    }

    if (dto.dayOfWeek !== undefined) {
      if (dto.dayOfWeek < 0 || dto.dayOfWeek > 6) {
        throw new DomainError('dayOfWeek must be between 0 (Sunday) and 6 (Saturday)', 400);
      }
      schedule.dayOfWeek = dto.dayOfWeek as DayOfWeek;
    }

    const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

    if (dto.startTime !== undefined) {
      if (!timeRegex.test(dto.startTime)) {
        throw new DomainError('startTime must be in HH:mm format', 400);
      }
      schedule.startTime = dto.startTime;
    }

    if (dto.endTime !== undefined) {
      if (!timeRegex.test(dto.endTime)) {
        throw new DomainError('endTime must be in HH:mm format', 400);
      }
      schedule.endTime = dto.endTime;
    }

    if (schedule.startTime >= schedule.endTime) {
      throw new DomainError('startTime must be before endTime', 400);
    }

    if (dto.isActive !== undefined) {
      schedule.isActive = dto.isActive;
    }

    // Verifica conflito com outros slots ativos (excluindo o atual)
    if (schedule.isActive) {
      const existingSlots = await this.scheduleRepository.findByOwnerAndDay(
        schedule.ownerId,
        schedule.ownerType,
        schedule.dayOfWeek,
      );

      for (const slot of existingSlots) {
        if (slot.id === scheduleId || !slot.isActive) continue;
        if (schedule.startTime < slot.endTime && schedule.endTime > slot.startTime) {
          throw new DomainError(
            `Schedule conflicts with existing slot (${slot.startTime} - ${slot.endTime})`,
            409,
          );
        }
      }
    }

    const updated = await this.scheduleRepository.update(schedule);
    return ScheduleMapper.toResponse(updated);
  }
}
