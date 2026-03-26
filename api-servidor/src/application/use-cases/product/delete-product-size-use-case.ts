import { ProductRepository } from '../../../domain/repositories/product-repository';
import { ProductSizeRepository } from '../../../domain/repositories/product-size-repository';
import { CompanyRepository } from '../../../domain/repositories/company-repository';
import { DomainError } from '../../../shared/errors';

export class DeleteProductSizeUseCase {
  constructor(
    private productRepository: ProductRepository,
    private productSizeRepository: ProductSizeRepository,
    private companyRepository: CompanyRepository,
  ) {}

  async execute(sizeId: string, userId: string): Promise<void> {
    const size = await this.productSizeRepository.findById(sizeId);
    if (!size) {
      throw new DomainError('Product size not found', 404);
    }

    const product = await this.productRepository.findById(size.productId);
    if (!product) {
      throw new DomainError('Product not found', 404);
    }

    const company = await this.companyRepository.findByUserId(userId);
    if (!company || company.id !== product.companyId) {
      throw new DomainError('Access denied: you are not the owner of this product', 403);
    }

    await this.productSizeRepository.delete(sizeId);
  }
}
