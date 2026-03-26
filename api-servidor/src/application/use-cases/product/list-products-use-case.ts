import { ProductRepository } from '../../../domain/repositories/product-repository';
import { ProductSizeRepository } from '../../../domain/repositories/product-size-repository';
import { ProductFavoriteRepository } from '../../../domain/repositories/product-favorite-repository';
import { ProductResponseDto } from '../../dtos/product-response-dto';
import { ProductMapper } from '../../../infrastructure/http/mappers/product-mapper';
import { PaginatedResult } from '../../../shared/interfaces/pagination';

export class ListProductsUseCase {
  constructor(
    private productRepository: ProductRepository,
    private productSizeRepository: ProductSizeRepository,
    private productFavoriteRepository: ProductFavoriteRepository,
  ) {}

  async execute(
    page: number,
    limit: number,
    companyId?: string,
    userId?: string,
  ): Promise<PaginatedResult<ProductResponseDto>> {
    const { rows, count } = companyId
      ? await this.productRepository.findByCompanyId(companyId, page, limit)
      : await this.productRepository.findAll(page, limit);

    const data: ProductResponseDto[] = [];

    for (const product of rows) {
      const sizes = await this.productSizeRepository.findByProductId(product.id!);
      let isFavorite = false;
      if (userId) {
        isFavorite = await this.productFavoriteRepository.isFavorite(userId, product.id!);
      }
      data.push(ProductMapper.toResponse(product, sizes, isFavorite));
    }

    return {
      data,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }
}
