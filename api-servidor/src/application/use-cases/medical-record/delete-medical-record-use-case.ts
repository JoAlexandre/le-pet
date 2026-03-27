import { MedicalRecordRepository } from '../../../domain/repositories/medical-record-repository';
import { MedicalRecordNotFoundError } from '../../../domain/errors/medical-record-not-found-error';
import { DomainError } from '../../../shared/errors';

export class DeleteMedicalRecordUseCase {
  constructor(private medicalRecordRepository: MedicalRecordRepository) {}

  async execute(id: string, professionalId: string, role: string): Promise<void> {
    const record = await this.medicalRecordRepository.findById(id);
    if (!record) {
      throw new MedicalRecordNotFoundError();
    }

    // Apenas o autor ou ADMIN pode excluir
    if (record.professionalId !== professionalId && role !== 'ADMIN') {
      throw new DomainError('Only the author or an admin can delete this medical record', 403);
    }

    await this.medicalRecordRepository.softDelete(id);
  }
}
