import { ProductQuestion } from '../../../domain/entities/product-question';
import { ProductQuestionModel } from '../models/product-question-model';

export class ProductQuestionDatabaseMapper {
  static toDomain(model: ProductQuestionModel): ProductQuestion {
    return new ProductQuestion({
      id: model.id,
      productId: model.productId,
      userId: model.userId,
      question: model.question,
      answer: model.answer,
      answeredBy: model.answeredBy,
      answeredAt: model.answeredAt,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toModel(entity: ProductQuestion): Partial<ProductQuestionModel> {
    return {
      id: entity.id,
      productId: entity.productId,
      userId: entity.userId,
      question: entity.question,
      answer: entity.answer ?? null,
      answeredBy: entity.answeredBy ?? null,
      answeredAt: entity.answeredAt ?? null,
    };
  }
}
