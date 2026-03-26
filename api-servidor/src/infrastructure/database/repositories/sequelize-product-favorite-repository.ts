import { ProductFavorite } from '../../../domain/entities/product-favorite';
import { ProductFavoriteRepository } from '../../../domain/repositories/product-favorite-repository';
import { ProductFavoriteModel } from '../models/product-favorite-model';
import { ProductFavoriteDatabaseMapper } from '../mappers/product-favorite-database-mapper';

export class SequelizeProductFavoriteRepository implements ProductFavoriteRepository {
  async findByUserAndProduct(userId: string, productId: string): Promise<ProductFavorite | null> {
    const model = await ProductFavoriteModel.findOne({
      where: { userId, productId },
    });
    return model ? ProductFavoriteDatabaseMapper.toDomain(model) : null;
  }

  async findByUserId(
    userId: string,
    page: number,
    limit: number,
  ): Promise<{ rows: ProductFavorite[]; count: number }> {
    const offset = (page - 1) * limit;
    const { rows, count } = await ProductFavoriteModel.findAndCountAll({
      where: { userId },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      rows: rows.map((r) => ProductFavoriteDatabaseMapper.toDomain(r)),
      count,
    };
  }

  async create(favorite: ProductFavorite): Promise<ProductFavorite> {
    const data = ProductFavoriteDatabaseMapper.toModel(favorite);
    const model = await ProductFavoriteModel.create(data as ProductFavoriteModel);
    return ProductFavoriteDatabaseMapper.toDomain(model);
  }

  async delete(userId: string, productId: string): Promise<void> {
    await ProductFavoriteModel.destroy({
      where: { userId, productId },
    });
  }

  async isFavorite(userId: string, productId: string): Promise<boolean> {
    const count = await ProductFavoriteModel.count({
      where: { userId, productId },
    });
    return count > 0;
  }
}
