import { ProductRepository } from '../../../domain/repositories/product-repository';
import { ProductRatingRepository } from '../../../domain/repositories/product-rating-repository';
import { ProductRatingResponseDto } from '../../dtos/product-response-dto';
import { PaginatedResult } from '../../../shared/interfaces/pagination';
import { DomainError } from '../../../shared/errors';

export class ListProductRatingsUseCase {
  constructor(
    private productRepository: ProductRepository,
    private productRatingRepository: ProductRatingRepository,
  ) {}

  async execute(
    productId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<ProductRatingResponseDto>> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new DomainError('Product not found', 404);
    }

    const { rows, count } = await this.productRatingRepository.findByProductId(
      productId,
      page,
      limit,
    );

    return {
      data: rows.map((r) => ({
        id: r.id!,
        userId: r.userId,
        rating: r.rating,
        comment: r.comment ?? null,
        createdAt: r.createdAt!,
      })),
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }
}
