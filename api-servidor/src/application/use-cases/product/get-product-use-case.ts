import { ProductRepository } from '../../../domain/repositories/product-repository';
import { ProductSizeRepository } from '../../../domain/repositories/product-size-repository';
import { ProductFavoriteRepository } from '../../../domain/repositories/product-favorite-repository';
import { ProductResponseDto } from '../../dtos/product-response-dto';
import { ProductMapper } from '../../../infrastructure/http/mappers/product-mapper';
import { DomainError } from '../../../shared/errors';

export class GetProductUseCase {
  constructor(
    private productRepository: ProductRepository,
    private productSizeRepository: ProductSizeRepository,
    private productFavoriteRepository: ProductFavoriteRepository,
  ) {}

  async execute(id: string, userId?: string): Promise<ProductResponseDto> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new DomainError('Product not found', 404);
    }

    const sizes = await this.productSizeRepository.findByProductId(id);

    let isFavorite = false;
    if (userId) {
      isFavorite = await this.productFavoriteRepository.isFavorite(userId, id);
    }

    return ProductMapper.toResponse(product, sizes, isFavorite);
  }
}
