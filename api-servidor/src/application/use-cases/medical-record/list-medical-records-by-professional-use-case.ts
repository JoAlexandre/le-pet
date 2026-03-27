import { MedicalRecordRepository } from '../../../domain/repositories/medical-record-repository';
import { MedicalRecordResponseDto } from '../../dtos/medical-record-response-dto';
import { MedicalRecordMapper } from '../../../infrastructure/http/mappers/medical-record-mapper';

export class ListMedicalRecordsByProfessionalUseCase {
  constructor(private medicalRecordRepository: MedicalRecordRepository) {}

  async execute(
    professionalId: string,
    page: number,
    limit: number,
  ): Promise<{
    data: MedicalRecordResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const result = await this.medicalRecordRepository.findByProfessionalId(
      professionalId,
      page,
      limit,
    );

    return {
      data: result.rows.map((r) => MedicalRecordMapper.toResponse(r)),
      total: result.count,
      page,
      limit,
      totalPages: Math.ceil(result.count / limit),
    };
  }
}
