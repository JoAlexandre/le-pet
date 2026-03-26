import { AppointmentRepository } from '../../../domain/repositories/appointment-repository';
import { AnimalRepository } from '../../../domain/repositories/animal-repository';
import { ServiceRepository } from '../../../domain/repositories/service-repository';
import { ScheduleRepository } from '../../../domain/repositories/schedule-repository';
import { CompanyProfessionalRepository } from '../../../domain/repositories/company-professional-repository';
import { UserRepository } from '../../../domain/repositories/user-repository';
import { Appointment } from '../../../domain/entities/appointment';
import { AppointmentStatus } from '../../../domain/enums/appointment-status';
import { ScheduleOwnerType } from '../../../domain/enums/schedule-owner-type';
import { DayOfWeek } from '../../../domain/enums/day-of-week';
import { CreateAppointmentDto } from '../../dtos/create-appointment-dto';
import { AppointmentResponseDto } from '../../dtos/appointment-response-dto';
import { AppointmentMapper } from '../../../infrastructure/http/mappers/appointment-mapper';
import { DomainError } from '../../../shared/errors';

export class CreateAppointmentUseCase {
  constructor(
    private appointmentRepository: AppointmentRepository,
    private animalRepository: AnimalRepository,
    private serviceRepository: ServiceRepository,
    private scheduleRepository: ScheduleRepository,
    private companyProfessionalRepository: CompanyProfessionalRepository,
    private userRepository: UserRepository,
  ) {}

  async execute(
    userId: string,
    role: string,
    dto: CreateAppointmentDto,
  ): Promise<AppointmentResponseDto> {
    // Admin pode criar agendamento em nome de um tutor
    const tutorId = (role === 'ADMIN' && dto.tutorId) ? dto.tutorId : userId;

    // Valida que o animal pertence ao tutor
    const animal = await this.animalRepository.findById(dto.animalId);
    if (!animal) {
      throw new DomainError('Animal not found', 404);
    }
    
    if (animal.tutorId !== tutorId) {
      throw new DomainError('Access denied: this animal does not belong to the tutor', 403);
    }

    // Valida que o profissional existe e tem role PROFESSIONAL
    const professional = await this.userRepository.findById(dto.professionalId);
    if (!professional || professional.role !== 'PROFESSIONAL') {
      throw new DomainError('Professional not found', 404);
    }

    // Valida o servico
    const service = await this.serviceRepository.findById(dto.serviceId);
    if (!service) {
      throw new DomainError('Service not found', 404);
    }

    // Valida formato do horario
    const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
    if (!timeRegex.test(dto.startTime) || !timeRegex.test(dto.endTime)) {
      throw new DomainError('startTime and endTime must be in HH:mm format', 400);
    }

    if (dto.startTime >= dto.endTime) {
      throw new DomainError('startTime must be before endTime', 400);
    }

    // Valida data
    const scheduledDate = new Date(`${dto.scheduledDate} 06:00:00`);
    if (isNaN(scheduledDate.getTime())) {
      throw new DomainError('scheduledDate must be a valid date (YYYY-MM-DD)', 400);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (scheduledDate < today) {
      throw new DomainError('scheduledDate cannot be in the past', 400);
    }

    // Determina se o profissional esta vinculado a uma empresa
    let companyId: string | null = null;
    const associations = await this.companyProfessionalRepository.findByUserId(
      dto.professionalId,
    );

    // Verifica disponibilidade dentro do calendario
    const dayOfWeek = scheduledDate.getDay() as DayOfWeek;

    let scheduleSlots;
    if (associations.length > 0) {
      // Profissional vinculado a empresa, usa calendario da empresa
      companyId = associations[0].companyId;
      scheduleSlots = await this.scheduleRepository.findByOwnerAndDay(
        companyId,
        ScheduleOwnerType.COMPANY,
        dayOfWeek,
      );
    } else {
      // Profissional independente, usa calendario proprio
      scheduleSlots = await this.scheduleRepository.findByOwnerAndDay(
        dto.professionalId,
        ScheduleOwnerType.PROFESSIONAL,
        dayOfWeek,
      );
    }

    // Verifica se o horario solicitado cabe em algum slot ativo
    const activeSlots = scheduleSlots.filter((s) => s.isActive);
    const fitsInSchedule = activeSlots.some(
      (slot) => dto.startTime >= slot.startTime && dto.endTime <= slot.endTime,
    );

    if (!fitsInSchedule) {
      throw new DomainError(
        'The requested time slot is not within the available schedule',
        400,
      );
    }

    // Verifica conflito com agendamentos existentes
    const conflict = await this.appointmentRepository.findConflicting(
      dto.professionalId,
      scheduledDate,
      dto.startTime,
      dto.endTime,
    );

    if (conflict) {
      throw new DomainError(
        'There is already an appointment for this professional at the requested time',
        409,
      );
    }

    const appointment = new Appointment({
      tutorId,
      animalId: dto.animalId,
      professionalId: dto.professionalId,
      companyId,
      serviceId: dto.serviceId,
      scheduledDate,
      startTime: dto.startTime,
      endTime: dto.endTime,
      status: AppointmentStatus.PENDING,
      notes: dto.notes || null,
    });

    const created = await this.appointmentRepository.create(appointment);
    return AppointmentMapper.toResponse(created);
  }
}
