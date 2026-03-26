import { ProductFavorite } from '../../../domain/entities/product-favorite';
import { ProductFavoriteModel } from '../models/product-favorite-model';

export class ProductFavoriteDatabaseMapper {
  static toDomain(model: ProductFavoriteModel): ProductFavorite {
    return new ProductFavorite({
      id: model.id,
      productId: model.productId,
      userId: model.userId,
      createdAt: model.createdAt,
    });
  }

  static toModel(entity: ProductFavorite): Partial<ProductFavoriteModel> {
    return {
      id: entity.id,
      productId: entity.productId,
      userId: entity.userId,
    };
  }
}
