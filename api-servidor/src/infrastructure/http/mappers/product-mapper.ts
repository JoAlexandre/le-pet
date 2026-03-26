import { Product } from '../../../domain/entities/product';
import { ProductSize } from '../../../domain/entities/product-size';
import {
  ProductResponseDto,
  ProductSizeResponseDto,
} from '../../../application/dtos/product-response-dto';

export class ProductMapper {
  static toSizeResponse(size: ProductSize): ProductSizeResponseDto {
    let effectivePrice = size.price;
    if (
      size.discountPercent &&
      size.discountExpiresAt &&
      new Date(size.discountExpiresAt) > new Date()
    ) {
      effectivePrice = size.price * (1 - size.discountPercent / 100);
      effectivePrice = Math.round(effectivePrice * 100) / 100;
    }

    return {
      id: size.id!,
      sizeType: size.sizeType,
      name: size.name,
      price: size.price,
      discountPercent: size.discountPercent ?? null,
      discountExpiresAt: size.discountExpiresAt ?? null,
      effectivePrice,
      stock: size.stock ?? null,
      isActive: size.isActive,
    };
  }

  static toResponse(
    product: Product,
    sizes: ProductSize[] = [],
    isFavorite = false,
  ): ProductResponseDto {
    const sizeDtos: ProductSizeResponseDto[] = sizes.map((s) => this.toSizeResponse(s));

    return {
      id: product.id!,
      companyId: product.companyId,
      name: product.name,
      description: product.description || null,
      category: product.category,
      productType: product.productType ?? null,
      imageUrl: product.imageUrl || null,
      averageRating: product.averageRating ?? null,
      totalRatings: product.totalRatings,
      isFavorite,
      isActive: product.isActive,
      sizes: sizeDtos,
      createdAt: product.createdAt!,
      updatedAt: product.updatedAt!,
    };
  }
}
