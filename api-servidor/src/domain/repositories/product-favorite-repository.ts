import { ProductFavorite } from '../entities/product-favorite';

export interface ProductFavoriteRepository {
  findByUserAndProduct(userId: string, productId: string): Promise<ProductFavorite | null>;
  findByUserId(
    userId: string,
    page: number,
    limit: number,
  ): Promise<{ rows: ProductFavorite[]; count: number }>;
  create(favorite: ProductFavorite): Promise<ProductFavorite>;
  delete(userId: string, productId: string): Promise<void>;
  isFavorite(userId: string, productId: string): Promise<boolean>;
}
