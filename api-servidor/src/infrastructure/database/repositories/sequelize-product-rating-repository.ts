import { Sequelize } from 'sequelize';
import { ProductRating } from '../../../domain/entities/product-rating';
import { ProductRatingRepository } from '../../../domain/repositories/product-rating-repository';
import { ProductRatingModel } from '../models/product-rating-model';
import { ProductRatingDatabaseMapper } from '../mappers/product-rating-database-mapper';

export class SequelizeProductRatingRepository implements ProductRatingRepository {
  async findById(id: string): Promise<ProductRating | null> {
    const model = await ProductRatingModel.findByPk(id);
    return model ? ProductRatingDatabaseMapper.toDomain(model) : null;
  }

  async findByProductId(
    productId: string,
    page: number,
    limit: number,
  ): Promise<{ rows: ProductRating[]; count: number }> {
    const offset = (page - 1) * limit;
    const { rows, count } = await ProductRatingModel.findAndCountAll({
      where: { productId },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      rows: rows.map((r) => ProductRatingDatabaseMapper.toDomain(r)),
      count,
    };
  }

  async findByUserAndProduct(userId: string, productId: string): Promise<ProductRating | null> {
    const model = await ProductRatingModel.findOne({
      where: { userId, productId },
    });
    return model ? ProductRatingDatabaseMapper.toDomain(model) : null;
  }

  async getAverageRating(productId: string): Promise<{ average: number; total: number }> {
    const result = await ProductRatingModel.findOne({
      where: { productId },
      attributes: [
        [Sequelize.fn('AVG', Sequelize.col('rating')), 'avg'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'cnt'],
      ],
      raw: true,
    });

    const raw = result as unknown as { avg: string | null; cnt: string };

    return {
      average: raw.avg ? Math.round(parseFloat(raw.avg) * 100) / 100 : 0,
      total: parseInt(raw.cnt || '0', 10),
    };
  }

  async create(rating: ProductRating): Promise<ProductRating> {
    const data = ProductRatingDatabaseMapper.toModel(rating);
    const model = await ProductRatingModel.create(data as ProductRatingModel);
    return ProductRatingDatabaseMapper.toDomain(model);
  }

  async update(rating: ProductRating): Promise<ProductRating> {
    const data = ProductRatingDatabaseMapper.toModel(rating);
    await ProductRatingModel.update(data, { where: { id: rating.id } });
    const updated = await ProductRatingModel.findByPk(rating.id);
    return ProductRatingDatabaseMapper.toDomain(updated!);
  }

  async delete(id: string): Promise<void> {
    await ProductRatingModel.destroy({ where: { id } });
  }
}
