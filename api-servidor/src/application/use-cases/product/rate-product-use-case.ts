import { ProductRepository } from '../../../domain/repositories/product-repository';
import { ProductRatingRepository } from '../../../domain/repositories/product-rating-repository';
import { ProductRating } from '../../../domain/entities/product-rating';
import { RateProductDto } from '../../dtos/rate-product-dto';
import { ProductRatingResponseDto } from '../../dtos/product-response-dto';
import { DomainError } from '../../../shared/errors';

export class RateProductUseCase {
  constructor(
    private productRepository: ProductRepository,
    private productRatingRepository: ProductRatingRepository,
  ) {}

  async execute(
    productId: string,
    userId: string,
    dto: RateProductDto,
  ): Promise<ProductRatingResponseDto> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new DomainError('Product not found', 404);
    }

    if (dto.rating < 1 || dto.rating > 5) {
      throw new DomainError('Rating must be between 1 and 5', 400);
    }

    const existing = await this.productRatingRepository.findByUserAndProduct(userId, productId);

    let saved: ProductRating;

    if (existing) {
      existing.rating = dto.rating;
      existing.comment = dto.comment ?? existing.comment;
      saved = await this.productRatingRepository.update(existing);
    } else {
      const rating = new ProductRating({
        productId,
        userId,
        rating: dto.rating,
        comment: dto.comment ?? null,
      });
      saved = await this.productRatingRepository.create(rating);
    }

    // Recalcula media do produto
    const { average, total } = await this.productRatingRepository.getAverageRating(productId);
    product.averageRating = average;
    product.totalRatings = total;
    await this.productRepository.update(product);

    return {
      id: saved.id!,
      userId: saved.userId,
      rating: saved.rating,
      comment: saved.comment ?? null,
      createdAt: saved.createdAt!,
    };
  }
}
