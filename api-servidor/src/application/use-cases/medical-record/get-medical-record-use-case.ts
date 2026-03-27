import { MedicalRecordRepository } from '../../../domain/repositories/medical-record-repository';
import { MedicalRecordResponseDto } from '../../dtos/medical-record-response-dto';
import { MedicalRecordMapper } from '../../../infrastructure/http/mappers/medical-record-mapper';
import { MedicalRecordNotFoundError } from '../../../domain/errors/medical-record-not-found-error';

export class GetMedicalRecordUseCase {
  constructor(private medicalRecordRepository: MedicalRecordRepository) {}

  async execute(id: string): Promise<MedicalRecordResponseDto> {
    const record = await this.medicalRecordRepository.findById(id);
    if (!record) {
      throw new MedicalRecordNotFoundError();
    }
    return MedicalRecordMapper.toResponse(record);
  }
}
