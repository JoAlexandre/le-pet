import { Service } from '../entities/service';

export interface ServiceRepository {
  findById(id: string): Promise<Service | null>;
  findByCompanyId(
    companyId: string,
    page: number,
    limit: number,
  ): Promise<{ rows: Service[]; count: number }>;
  findByProfessionalId(
    professionalId: string,
    page: number,
    limit: number,
  ): Promise<{ rows: Service[]; count: number }>;
  findAll(page: number, limit: number): Promise<{ rows: Service[]; count: number }>;
  create(service: Service): Promise<Service>;
  update(service: Service): Promise<Service>;
  softDelete(id: string): Promise<void>;
}
