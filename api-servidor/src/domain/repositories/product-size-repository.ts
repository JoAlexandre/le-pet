import { ProductSize } from '../entities/product-size';

export interface ProductSizeRepository {
  findById(id: string): Promise<ProductSize | null>;
  findByProductId(productId: string): Promise<ProductSize[]>;
  create(size: ProductSize): Promise<ProductSize>;
  update(size: ProductSize): Promise<ProductSize>;
  delete(id: string): Promise<void>;
}
