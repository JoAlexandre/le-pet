import { ProductRepository } from '../../../domain/repositories/product-repository';
import { CompanyRepository } from '../../../domain/repositories/company-repository';
import { DomainError } from '../../../shared/errors';

export class DeleteProductUseCase {
  constructor(
    private productRepository: ProductRepository,
    private companyRepository: CompanyRepository,
  ) {}

  async execute(productId: string, userId: string): Promise<void> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new DomainError('Product not found', 404);
    }

    const company = await this.companyRepository.findByUserId(userId);
    if (!company || company.id !== product.companyId) {
      throw new DomainError('Access denied: you are not the owner of this product', 403);
    }

    await this.productRepository.softDelete(productId);
  }
}
