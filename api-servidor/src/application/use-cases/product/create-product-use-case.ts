import { ProductRepository } from '../../../domain/repositories/product-repository';
import { ProductSizeRepository } from '../../../domain/repositories/product-size-repository';
import { CompanyRepository } from '../../../domain/repositories/company-repository';
import { Product } from '../../../domain/entities/product';
import { ProductSize } from '../../../domain/entities/product-size';
import { ProductCategory } from '../../../domain/enums/product-category';
import { ProductType } from '../../../domain/enums/product-type';
import { SizeType } from '../../../domain/enums/size-type';
import { CreateProductDto } from '../../dtos/create-product-dto';
import { ProductResponseDto } from '../../dtos/product-response-dto';
import { ProductMapper } from '../../../infrastructure/http/mappers/product-mapper';
import { DomainError } from '../../../shared/errors';

export class CreateProductUseCase {
  constructor(
    private productRepository: ProductRepository,
    private productSizeRepository: ProductSizeRepository,
    private companyRepository: CompanyRepository,
  ) {}

  async execute(userId: string, dto: CreateProductDto): Promise<ProductResponseDto> {
    const company = await this.companyRepository.findByUserId(userId);
    if (!company) {
      throw new DomainError('Company not found for this user', 404);
    }

    if (!Object.values(ProductCategory).includes(dto.category as ProductCategory)) {
      throw new DomainError(
        `Invalid category. Must be one of: ${Object.values(ProductCategory).join(', ')}`,
        400,
      );
    }

    if (dto.productType && !Object.values(ProductType).includes(dto.productType as ProductType)) {
      throw new DomainError(
        `Invalid product type. Must be one of: ${Object.values(ProductType).join(', ')}`,
        400,
      );
    }

    const product = new Product({
      companyId: company.id!,
      name: dto.name,
      description: dto.description || null,
      category: dto.category as ProductCategory,
      productType: (dto.productType as ProductType) ?? null,
      imageUrl: dto.imageUrl || null,
      isActive: true,
    });

    const created = await this.productRepository.create(product);

    const sizes: ProductSize[] = [];
    if (dto.sizes && dto.sizes.length > 0) {
      for (const sizeDto of dto.sizes) {
        if (!Object.values(SizeType).includes(sizeDto.sizeType as SizeType)) {
          throw new DomainError(
            `Invalid size type. Must be one of: ${Object.values(SizeType).join(', ')}`,
            400,
          );
        }
        if (sizeDto.price < 0) {
          throw new DomainError('Price must be a positive value', 400);
        }
        if (sizeDto.discountPercent !== undefined) {
          if (sizeDto.discountPercent < 0 || sizeDto.discountPercent > 100) {
            throw new DomainError('Discount percent must be between 0 and 100', 400);
          }
        }
        const size = new ProductSize({
          productId: created.id!,
          sizeType: sizeDto.sizeType as SizeType,
          name: sizeDto.name,
          price: sizeDto.price,
          discountPercent: sizeDto.discountPercent ?? null,
          discountExpiresAt: sizeDto.discountExpiresAt ? new Date(sizeDto.discountExpiresAt) : null,
          stock: sizeDto.stock ?? null,
          isActive: true,
        });
        const createdSize = await this.productSizeRepository.create(size);
        sizes.push(createdSize);
      }
    }

    return ProductMapper.toResponse(created, sizes);
  }
}
