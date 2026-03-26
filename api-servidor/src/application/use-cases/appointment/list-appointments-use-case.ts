import { AppointmentRepository } from '../../../domain/repositories/appointment-repository';
import { CompanyRepository } from '../../../domain/repositories/company-repository';
import { AppointmentResponseDto } from '../../dtos/appointment-response-dto';
import { AppointmentMapper } from '../../../infrastructure/http/mappers/appointment-mapper';
import { PaginatedResult } from '../../../shared/interfaces/pagination';
import { DomainError } from '../../../shared/errors';

export class ListAppointmentsUseCase {
  constructor(
    private appointmentRepository: AppointmentRepository,
    private companyRepository: CompanyRepository,
  ) {}

  async execute(
    userId: string,
    role: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<AppointmentResponseDto>> {
    let result: { rows: import('../../../domain/entities/appointment').Appointment[]; count: number };

    if (role === 'TUTOR') {
      result = await this.appointmentRepository.findByTutorId(userId, page, limit);
    } else if (role === 'PROFESSIONAL') {
      result = await this.appointmentRepository.findByProfessionalId(userId, page, limit);
    } else if (role === 'COMPANY') {
      const company = await this.companyRepository.findByUserId(userId);
      if (!company) {
        throw new DomainError('Company not found for this user', 404);
      }
      result = await this.appointmentRepository.findByCompanyId(company.id!, page, limit);
    } else if (role === 'ADMIN') {
      result = await this.appointmentRepository.findAll(page, limit);
    } else {
      throw new DomainError('Access denied', 403);
    }

    return {
      data: result.rows.map((a) => AppointmentMapper.toResponse(a)),
      total: result.count,
      page,
      limit,
      totalPages: Math.ceil(result.count / limit),
    };
  }
}
