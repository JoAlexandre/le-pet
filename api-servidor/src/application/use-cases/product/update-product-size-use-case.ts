import { ProductRepository } from '../../../domain/repositories/product-repository';
import { ProductSizeRepository } from '../../../domain/repositories/product-size-repository';
import { CompanyRepository } from '../../../domain/repositories/company-repository';
import { SizeType } from '../../../domain/enums/size-type';
import { ProductSizeResponseDto } from '../../dtos/product-response-dto';
import { ProductMapper } from '../../../infrastructure/http/mappers/product-mapper';
import { DomainError } from '../../../shared/errors';

export interface UpdateProductSizeDto {
  sizeType?: string;
  name?: string;
  price?: number;
  discountPercent?: number | null;
  discountExpiresAt?: string | null;
  stock?: number | null;
  isActive?: boolean;
}

export class UpdateProductSizeUseCase {
  constructor(
    private productRepository: ProductRepository,
    private productSizeRepository: ProductSizeRepository,
    private companyRepository: CompanyRepository,
  ) {}

  async execute(
    sizeId: string,
    userId: string,
    dto: UpdateProductSizeDto,
  ): Promise<ProductSizeResponseDto> {
    const size = await this.productSizeRepository.findById(sizeId);
    if (!size) {
      throw new DomainError('Product size not found', 404);
    }

    const product = await this.productRepository.findById(size.productId);
    if (!product) {
      throw new DomainError('Product not found', 404);
    }

    const company = await this.companyRepository.findByUserId(userId);
    if (!company || company.id !== product.companyId) {
      throw new DomainError('Access denied: you are not the owner of this product', 403);
    }

    if (dto.sizeType !== undefined) {
      if (!Object.values(SizeType).includes(dto.sizeType as SizeType)) {
        throw new DomainError(
          `Invalid size type. Must be one of: ${Object.values(SizeType).join(', ')}`,
          400,
        );
      }
      size.sizeType = dto.sizeType as SizeType;
    }

    if (dto.price !== undefined && dto.price < 0) {
      throw new DomainError('Price must be a positive value', 400);
    }

    if (dto.discountPercent !== undefined && dto.discountPercent !== null) {
      if (dto.discountPercent < 0 || dto.discountPercent > 100) {
        throw new DomainError('Discount percent must be between 0 and 100', 400);
      }
    }

    if (dto.name !== undefined) {
      size.name = dto.name;
    }
    if (dto.price !== undefined) {
      size.price = dto.price;
    }
    if (dto.discountPercent !== undefined) {
      size.discountPercent = dto.discountPercent;
    }
    if (dto.discountExpiresAt !== undefined) {
      size.discountExpiresAt = dto.discountExpiresAt ? new Date(dto.discountExpiresAt) : null;
    }
    if (dto.stock !== undefined) {
      size.stock = dto.stock;
    }
    if (dto.isActive !== undefined) {
      size.isActive = dto.isActive;
    }

    const updated = await this.productSizeRepository.update(size);

    return ProductMapper.toSizeResponse(updated);
  }
}
