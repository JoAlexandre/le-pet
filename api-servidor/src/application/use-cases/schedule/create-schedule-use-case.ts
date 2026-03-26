import { ScheduleRepository } from '../../../domain/repositories/schedule-repository';
import { CompanyRepository } from '../../../domain/repositories/company-repository';
import { CompanyProfessionalRepository } from '../../../domain/repositories/company-professional-repository';
import { Schedule } from '../../../domain/entities/schedule';
import { DayOfWeek } from '../../../domain/enums/day-of-week';
import { ScheduleOwnerType } from '../../../domain/enums/schedule-owner-type';
import { CreateScheduleDto } from '../../dtos/create-schedule-dto';
import { ScheduleResponseDto } from '../../dtos/schedule-response-dto';
import { ScheduleMapper } from '../../../infrastructure/http/mappers/schedule-mapper';
import { DomainError } from '../../../shared/errors';

export class CreateScheduleUseCase {
  constructor(
    private scheduleRepository: ScheduleRepository,
    private companyRepository: CompanyRepository,
    private companyProfessionalRepository: CompanyProfessionalRepository,
  ) {}

  async execute(
    userId: string,
    role: string,
    dto: CreateScheduleDto,
  ): Promise<ScheduleResponseDto> {
    if (dto.dayOfWeek < 0 || dto.dayOfWeek > 6) {
      throw new DomainError('dayOfWeek must be between 0 (Sunday) and 6 (Saturday)', 400);
    }

    const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
    if (!timeRegex.test(dto.startTime) || !timeRegex.test(dto.endTime)) {
      throw new DomainError('startTime and endTime must be in HH:mm format', 400);
    }

    if (dto.startTime >= dto.endTime) {
      throw new DomainError('startTime must be before endTime', 400);
    }

    let ownerId: string;
    let ownerType: ScheduleOwnerType;

    if (role === 'ADMIN') {
      // Admin pode criar calendario para qualquer profissional ou empresa
      if (!dto.ownerId || !dto.ownerType) {
        throw new DomainError(
          'Admin must provide ownerId and ownerType (COMPANY or PROFESSIONAL)',
          400,
        );
      }
      if (!Object.values(ScheduleOwnerType).includes(dto.ownerType as ScheduleOwnerType)) {
        throw new DomainError(
          `Invalid ownerType. Must be one of: ${Object.values(ScheduleOwnerType).join(', ')}`,
          400,
        );
      }
      ownerId = dto.ownerId;
      ownerType = dto.ownerType as ScheduleOwnerType;
    } else if (role === 'COMPANY') {
      const company = await this.companyRepository.findByUserId(userId);
      if (!company) {
        throw new DomainError('Company not found for this user', 404);
      }
      ownerId = company.id!;
      ownerType = ScheduleOwnerType.COMPANY;
    } else if (role === 'PROFESSIONAL') {
      // Verifica se o profissional esta vinculado a alguma empresa
      const associations = await this.companyProfessionalRepository.findByUserId(userId);
      if (associations.length > 0) {
        throw new DomainError(
          'Professionals linked to a company cannot create their own schedule. ' +
          'The company manages the schedule.',
          403,
        );
      }
      ownerId = userId;
      ownerType = ScheduleOwnerType.PROFESSIONAL;
    } else {
      throw new DomainError('Only ADMIN, COMPANY or PROFESSIONAL roles can create schedules', 403);
    }

    // Verifica conflito de horario no mesmo dia
    const existingSlots = await this.scheduleRepository.findByOwnerAndDay(
      ownerId,
      ownerType,
      dto.dayOfWeek as DayOfWeek,
    );

    for (const slot of existingSlots) {
      if (!slot.isActive) continue;
      if (dto.startTime < slot.endTime && dto.endTime > slot.startTime) {
        throw new DomainError(
          `Schedule conflicts with existing slot (${slot.startTime} - ${slot.endTime})`,
          409,
        );
      }
    }

    const schedule = new Schedule({
      ownerId,
      ownerType,
      dayOfWeek: dto.dayOfWeek as DayOfWeek,
      startTime: dto.startTime,
      endTime: dto.endTime,
      isActive: true,
    });

    const created = await this.scheduleRepository.create(schedule);
    return ScheduleMapper.toResponse(created);
  }
}
