import { ProductRepository } from '../../../domain/repositories/product-repository';
import { ProductQuestionRepository } from '../../../domain/repositories/product-question-repository';
import { ProductQuestion } from '../../../domain/entities/product-question';
import { AskProductQuestionDto } from '../../dtos/ask-product-question-dto';
import { ProductQuestionResponseDto } from '../../dtos/product-response-dto';
import { DomainError } from '../../../shared/errors';

export class AskProductQuestionUseCase {
  constructor(
    private productRepository: ProductRepository,
    private productQuestionRepository: ProductQuestionRepository,
  ) {}

  async execute(
    productId: string,
    userId: string,
    dto: AskProductQuestionDto,
  ): Promise<ProductQuestionResponseDto> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new DomainError('Product not found', 404);
    }

    // Limite de 1 pergunta por usuario por produto
    const existing = await this.productQuestionRepository.findByUserAndProduct(userId, productId);
    if (existing) {
      throw new DomainError('You have already asked a question for this product', 409);
    }

    const question = new ProductQuestion({
      productId,
      userId,
      question: dto.question,
    });

    const created = await this.productQuestionRepository.create(question);

    return {
      id: created.id!,
      userId: created.userId,
      question: created.question,
      answer: null,
      answeredAt: null,
      createdAt: created.createdAt!,
    };
  }
}
