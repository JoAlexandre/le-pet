import { MedicalRecord } from '../entities/medical-record';

export interface MedicalRecordRepository {
  findById(id: string): Promise<MedicalRecord | null>;
  findByAnimalId(
    animalId: string,
    page: number,
    limit: number,
  ): Promise<{ rows: MedicalRecord[]; count: number }>;
  findByProfessionalId(
    professionalId: string,
    page: number,
    limit: number,
  ): Promise<{ rows: MedicalRecord[]; count: number }>;
  findByAnimalIdAndType(
    animalId: string,
    type: string,
    page: number,
    limit: number,
  ): Promise<{ rows: MedicalRecord[]; count: number }>;
  create(medicalRecord: MedicalRecord): Promise<MedicalRecord>;
  update(medicalRecord: MedicalRecord): Promise<MedicalRecord>;
  countByProfessionalIdInMonth(
    professionalId: string,
    year: number,
    month: number,
  ): Promise<number>;
  softDelete(id: string): Promise<void>;
}
