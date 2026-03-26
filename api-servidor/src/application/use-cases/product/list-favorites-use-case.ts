import { ProductRepository } from '../../../domain/repositories/product-repository';
import { ProductFavoriteRepository } from '../../../domain/repositories/product-favorite-repository';
import { ProductSizeRepository } from '../../../domain/repositories/product-size-repository';
import { ProductResponseDto } from '../../dtos/product-response-dto';
import { ProductMapper } from '../../../infrastructure/http/mappers/product-mapper';
import { PaginatedResult } from '../../../shared/interfaces/pagination';

export class ListFavoritesUseCase {
  constructor(
    private productRepository: ProductRepository,
    private productFavoriteRepository: ProductFavoriteRepository,
    private productSizeRepository: ProductSizeRepository,
  ) {}

  async execute(
    userId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<ProductResponseDto>> {
    const { rows: favorites, count } = await this.productFavoriteRepository.findByUserId(
      userId,
      page,
      limit,
    );

    const products: ProductResponseDto[] = [];

    for (const fav of favorites) {
      const product = await this.productRepository.findById(fav.productId);
      if (product) {
        const sizes = await this.productSizeRepository.findByProductId(fav.productId);
        products.push(ProductMapper.toResponse(product, sizes, true));
      }
    }

    return {
      data: products,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }
}
