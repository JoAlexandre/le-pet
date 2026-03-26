import { ProductSize } from '../../../domain/entities/product-size';
import { SizeType } from '../../../domain/enums/size-type';
import { ProductSizeModel } from '../models/product-size-model';

export class ProductSizeDatabaseMapper {
  static toDomain(model: ProductSizeModel): ProductSize {
    return new ProductSize({
      id: model.id,
      productId: model.productId,
      sizeType: model.sizeType as SizeType,
      name: model.name,
      price: Number(model.price),
      discountPercent: model.discountPercent ? Number(model.discountPercent) : null,
      discountExpiresAt: model.discountExpiresAt ?? null,
      stock: model.stock,
      isActive: model.isActive,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toModel(entity: ProductSize): Partial<ProductSizeModel> {
    return {
      id: entity.id,
      productId: entity.productId,
      sizeType: entity.sizeType,
      name: entity.name,
      price: entity.price,
      discountPercent: entity.discountPercent ?? null,
      discountExpiresAt: entity.discountExpiresAt ?? null,
      stock: entity.stock ?? null,
      isActive: entity.isActive,
    };
  }
}
