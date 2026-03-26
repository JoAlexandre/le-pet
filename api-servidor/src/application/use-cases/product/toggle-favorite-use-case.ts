import { ProductRepository } from '../../../domain/repositories/product-repository';
import { ProductFavoriteRepository } from '../../../domain/repositories/product-favorite-repository';
import { ProductFavorite } from '../../../domain/entities/product-favorite';
import { DomainError } from '../../../shared/errors';

export class ToggleFavoriteUseCase {
  constructor(
    private productRepository: ProductRepository,
    private productFavoriteRepository: ProductFavoriteRepository,
  ) {}

  async execute(productId: string, userId: string): Promise<{ isFavorite: boolean }> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new DomainError('Product not found', 404);
    }

    const existing = await this.productFavoriteRepository.findByUserAndProduct(userId, productId);

    if (existing) {
      await this.productFavoriteRepository.delete(userId, productId);
      return { isFavorite: false };
    }

    const favorite = new ProductFavorite({
      productId,
      userId,
    });
    await this.productFavoriteRepository.create(favorite);
    return { isFavorite: true };
  }
}
