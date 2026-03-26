import { ProductRepository } from '../../../domain/repositories/product-repository';
import { ProductSizeRepository } from '../../../domain/repositories/product-size-repository';
import { CompanyRepository } from '../../../domain/repositories/company-repository';
import { ProductSize } from '../../../domain/entities/product-size';
import { SizeType } from '../../../domain/enums/size-type';
import { CreateProductSizeDto } from '../../dtos/create-product-dto';
import { ProductSizeResponseDto } from '../../dtos/product-response-dto';
import { ProductMapper } from '../../../infrastructure/http/mappers/product-mapper';
import { DomainError } from '../../../shared/errors';

export class AddProductSizeUseCase {
  constructor(
    private productRepository: ProductRepository,
    private productSizeRepository: ProductSizeRepository,
    private companyRepository: CompanyRepository,
  ) {}

  async execute(
    productId: string,
    userId: string,
    dto: CreateProductSizeDto,
  ): Promise<ProductSizeResponseDto> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new DomainError('Product not found', 404);
    }

    const company = await this.companyRepository.findByUserId(userId);
    if (!company || company.id !== product.companyId) {
      throw new DomainError('Access denied: you are not the owner of this product', 403);
    }

    if (!Object.values(SizeType).includes(dto.sizeType as SizeType)) {
      throw new DomainError(
        `Invalid size type. Must be one of: ${Object.values(SizeType).join(', ')}`,
        400,
      );
    }

    if (dto.price < 0) {
      throw new DomainError('Price must be a positive value', 400);
    }

    if (dto.discountPercent !== undefined) {
      if (dto.discountPercent < 0 || dto.discountPercent > 100) {
        throw new DomainError('Discount percent must be between 0 and 100', 400);
      }
    }

    const size = new ProductSize({
      productId,
      sizeType: dto.sizeType as SizeType,
      name: dto.name,
      price: dto.price,
      discountPercent: dto.discountPercent ?? null,
      discountExpiresAt: dto.discountExpiresAt ? new Date(dto.discountExpiresAt) : null,
      stock: dto.stock ?? null,
      isActive: true,
    });

    const created = await this.productSizeRepository.create(size);

    return ProductMapper.toSizeResponse(created);
  }
}
