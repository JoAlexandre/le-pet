import { VaccineRecord } from '../entities/vaccine-record';

export interface VaccineRecordRepository {
  findById(id: string): Promise<VaccineRecord | null>;
  findAll(page: number, limit: number): Promise<{ rows: VaccineRecord[]; count: number }>;
  findByAnimalId(
    animalId: string,
    page: number,
    limit: number,
  ): Promise<{ rows: VaccineRecord[]; count: number }>;
  findByTutorId(
    tutorId: string,
    page: number,
    limit: number,
  ): Promise<{ rows: VaccineRecord[]; count: number }>;
  findByProfessionalId(
    professionalId: string,
    page: number,
    limit: number,
  ): Promise<{ rows: VaccineRecord[]; count: number }>;
  create(vaccineRecord: VaccineRecord): Promise<VaccineRecord>;
}
