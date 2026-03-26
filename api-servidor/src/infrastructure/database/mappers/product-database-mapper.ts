import { Product } from '../../../domain/entities/product';
import { ProductCategory } from '../../../domain/enums/product-category';
import { ProductType } from '../../../domain/enums/product-type';
import { ProductModel } from '../models/product-model';

export class ProductDatabaseMapper {
  static toDomain(model: ProductModel): Product {
    return new Product({
      id: model.id,
      companyId: model.companyId,
      name: model.name,
      description: model.description,
      category: model.category as ProductCategory,
      productType: model.productType ? (model.productType as ProductType) : null,
      imageUrl: model.imageUrl,
      averageRating: model.averageRating ? Number(model.averageRating) : null,
      totalRatings: model.totalRatings,
      isActive: model.isActive,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      deletedAt: model.deletedAt,
    });
  }

  static toModel(entity: Product): Partial<ProductModel> {
    return {
      id: entity.id,
      companyId: entity.companyId,
      name: entity.name,
      description: entity.description ?? null,
      category: entity.category,
      productType: entity.productType ?? null,
      imageUrl: entity.imageUrl ?? null,
      averageRating: entity.averageRating ?? null,
      totalRatings: entity.totalRatings,
      isActive: entity.isActive,
    };
  }
}
