import { DomainError } from '../../shared/errors';

export class ProductNotFoundError extends DomainError {
  constructor() {
    super('Product not found', 404);
  }
}
