import { ProductRepository } from '../../../domain/repositories/product-repository';
import { ProductQuestionRepository } from '../../../domain/repositories/product-question-repository';
import { CompanyRepository } from '../../../domain/repositories/company-repository';
import { AnswerProductQuestionDto } from '../../dtos/answer-product-question-dto';
import { ProductQuestionResponseDto } from '../../dtos/product-response-dto';
import { DomainError } from '../../../shared/errors';

export class AnswerProductQuestionUseCase {
  constructor(
    private productRepository: ProductRepository,
    private productQuestionRepository: ProductQuestionRepository,
    private companyRepository: CompanyRepository,
  ) {}

  async execute(
    questionId: string,
    userId: string,
    dto: AnswerProductQuestionDto,
  ): Promise<ProductQuestionResponseDto> {
    const question = await this.productQuestionRepository.findById(questionId);
    if (!question) {
      throw new DomainError('Question not found', 404);
    }

    const product = await this.productRepository.findById(question.productId);
    if (!product) {
      throw new DomainError('Product not found', 404);
    }

    const company = await this.companyRepository.findByUserId(userId);
    if (!company || company.id !== product.companyId) {
      throw new DomainError('Access denied: only the product owner can answer questions', 403);
    }

    question.answer = dto.answer;
    question.answeredBy = userId;
    question.answeredAt = new Date();

    const updated = await this.productQuestionRepository.update(question);

    return {
      id: updated.id!,
      userId: updated.userId,
      question: updated.question,
      answer: updated.answer ?? null,
      answeredAt: updated.answeredAt ?? null,
      createdAt: updated.createdAt!,
    };
  }
}
