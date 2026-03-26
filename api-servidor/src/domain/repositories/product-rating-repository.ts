import { ProductRating } from '../entities/product-rating';

export interface ProductRatingRepository {
  findById(id: string): Promise<ProductRating | null>;
  findByProductId(
    productId: string,
    page: number,
    limit: number,
  ): Promise<{ rows: ProductRating[]; count: number }>;
  findByUserAndProduct(userId: string, productId: string): Promise<ProductRating | null>;
  getAverageRating(productId: string): Promise<{ average: number; total: number }>;
  create(rating: ProductRating): Promise<ProductRating>;
  update(rating: ProductRating): Promise<ProductRating>;
  delete(id: string): Promise<void>;
}
