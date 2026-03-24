import { DomainError } from '../../shared/errors';

export class AnimalLimitExceededError extends DomainError {
  constructor() {
    super('Animal limit exceeded for your current plan', 403);
  }
}
