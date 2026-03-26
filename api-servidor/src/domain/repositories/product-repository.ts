import { Product } from '../entities/product';

export interface ProductRepository {
  findById(id: string): Promise<Product | null>;
  findByCompanyId(
    companyId: string,
    page: number,
    limit: number,
  ): Promise<{ rows: Product[]; count: number }>;
  findAll(page: number, limit: number): Promise<{ rows: Product[]; count: number }>;
  create(product: Product): Promise<Product>;
  update(product: Product): Promise<Product>;
  softDelete(id: string): Promise<void>;
}
