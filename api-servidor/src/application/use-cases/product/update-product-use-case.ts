import { ProductRepository } from '../../../domain/repositories/product-repository';
import { ProductSizeRepository } from '../../../domain/repositories/product-size-repository';
import { ProductFavoriteRepository } from '../../../domain/repositories/product-favorite-repository';
import { CompanyRepository } from '../../../domain/repositories/company-repository';
import { ProductCategory } from '../../../domain/enums/product-category';
import { ProductType } from '../../../domain/enums/product-type';
import { UpdateProductDto } from '../../dtos/update-product-dto';
import { ProductResponseDto } from '../../dtos/product-response-dto';
import { ProductMapper } from '../../../infrastructure/http/mappers/product-mapper';
import { DomainError } from '../../../shared/errors';

export class UpdateProductUseCase {
  constructor(
    private productRepository: ProductRepository,
    private productSizeRepository: ProductSizeRepository,
    private productFavoriteRepository: ProductFavoriteRepository,
    private companyRepository: CompanyRepository,
  ) {}

  async execute(
    productId: string,
    userId: string,
    dto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new DomainError('Product not found', 404);
    }

    const company = await this.companyRepository.findByUserId(userId);
    if (!company || company.id !== product.companyId) {
      throw new DomainError('Access denied: you are not the owner of this product', 403);
    }

    if (dto.category !== undefined) {
      if (!Object.values(ProductCategory).includes(dto.category as ProductCategory)) {
        throw new DomainError(
          `Invalid category. Must be one of: ${Object.values(ProductCategory).join(', ')}`,
          400,
        );
      }
      product.category = dto.category as ProductCategory;
    }

    if (dto.productType !== undefined) {
      if (
        dto.productType !== null &&
        !Object.values(ProductType).includes(dto.productType as ProductType)
      ) {
        throw new DomainError(
          `Invalid product type. Must be one of: ${Object.values(ProductType).join(', ')}`,
          400,
        );
      }
      product.productType = (dto.productType as ProductType) ?? null;
    }

    if (dto.name !== undefined) {
      product.name = dto.name;
    }
    if (dto.description !== undefined) {
      product.description = dto.description || null;
    }
    if (dto.imageUrl !== undefined) {
      product.imageUrl = dto.imageUrl || null;
    }
    if (dto.isActive !== undefined) {
      product.isActive = dto.isActive;
    }

    const updated = await this.productRepository.update(product);
    const sizes = await this.productSizeRepository.findByProductId(productId);
    const isFavorite = await this.productFavoriteRepository.isFavorite(userId, productId);
    return ProductMapper.toResponse(updated, sizes, isFavorite);
  }
}
