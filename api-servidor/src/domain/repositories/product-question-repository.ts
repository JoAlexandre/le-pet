import { ProductQuestion } from '../entities/product-question';

export interface ProductQuestionRepository {
  findById(id: string): Promise<ProductQuestion | null>;
  findByProductId(
    productId: string,
    page: number,
    limit: number,
  ): Promise<{ rows: ProductQuestion[]; count: number }>;
  findByUserAndProduct(userId: string, productId: string): Promise<ProductQuestion | null>;
  create(question: ProductQuestion): Promise<ProductQuestion>;
  update(question: ProductQuestion): Promise<ProductQuestion>;
  delete(id: string): Promise<void>;
}
