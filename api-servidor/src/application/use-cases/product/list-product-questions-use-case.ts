import { ProductRepository } from '../../../domain/repositories/product-repository';
import { ProductQuestionRepository } from '../../../domain/repositories/product-question-repository';
import { ProductQuestionResponseDto } from '../../dtos/product-response-dto';
import { PaginatedResult } from '../../../shared/interfaces/pagination';
import { DomainError } from '../../../shared/errors';

export class ListProductQuestionsUseCase {
  constructor(
    private productRepository: ProductRepository,
    private productQuestionRepository: ProductQuestionRepository,
  ) {}

  async execute(
    productId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<ProductQuestionResponseDto>> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new DomainError('Product not found', 404);
    }

    const { rows, count } = await this.productQuestionRepository.findByProductId(
      productId,
      page,
      limit,
    );

    return {
      data: rows.map((q) => ({
        id: q.id!,
        userId: q.userId,
        question: q.question,
        answer: q.answer ?? null,
        answeredAt: q.answeredAt ?? null,
        createdAt: q.createdAt!,
      })),
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }
}
