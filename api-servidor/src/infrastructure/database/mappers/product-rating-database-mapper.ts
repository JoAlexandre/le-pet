import { ProductRating } from '../../../domain/entities/product-rating';
import { ProductRatingModel } from '../models/product-rating-model';

export class ProductRatingDatabaseMapper {
  static toDomain(model: ProductRatingModel): ProductRating {
    return new ProductRating({
      id: model.id,
      productId: model.productId,
      userId: model.userId,
      rating: model.rating,
      comment: model.comment,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toModel(entity: ProductRating): Partial<ProductRatingModel> {
    return {
      id: entity.id,
      productId: entity.productId,
      userId: entity.userId,
      rating: entity.rating,
      comment: entity.comment ?? null,
    };
  }
}
