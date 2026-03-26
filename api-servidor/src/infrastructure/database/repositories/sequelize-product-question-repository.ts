import { ProductQuestion } from '../../../domain/entities/product-question';
import { ProductQuestionRepository } from '../../../domain/repositories/product-question-repository';
import { ProductQuestionModel } from '../models/product-question-model';
import { ProductQuestionDatabaseMapper } from '../mappers/product-question-database-mapper';

export class SequelizeProductQuestionRepository implements ProductQuestionRepository {
  async findById(id: string): Promise<ProductQuestion | null> {
    const model = await ProductQuestionModel.findByPk(id);
    return model ? ProductQuestionDatabaseMapper.toDomain(model) : null;
  }

  async findByProductId(
    productId: string,
    page: number,
    limit: number,
  ): Promise<{ rows: ProductQuestion[]; count: number }> {
    const offset = (page - 1) * limit;
    const { rows, count } = await ProductQuestionModel.findAndCountAll({
      where: { productId },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      rows: rows.map((r) => ProductQuestionDatabaseMapper.toDomain(r)),
      count,
    };
  }

  async findByUserAndProduct(userId: string, productId: string): Promise<ProductQuestion | null> {
    const model = await ProductQuestionModel.findOne({
      where: { userId, productId },
    });
    return model ? ProductQuestionDatabaseMapper.toDomain(model) : null;
  }

  async create(question: ProductQuestion): Promise<ProductQuestion> {
    const data = ProductQuestionDatabaseMapper.toModel(question);
    const model = await ProductQuestionModel.create(data as ProductQuestionModel);
    return ProductQuestionDatabaseMapper.toDomain(model);
  }

  async update(question: ProductQuestion): Promise<ProductQuestion> {
    const data = ProductQuestionDatabaseMapper.toModel(question);
    await ProductQuestionModel.update(data, { where: { id: question.id } });
    const updated = await ProductQuestionModel.findByPk(question.id);
    return ProductQuestionDatabaseMapper.toDomain(updated!);
  }

  async delete(id: string): Promise<void> {
    await ProductQuestionModel.destroy({ where: { id } });
  }
}
