import { DomainError } from '../../shared/errors';

export class SubscriptionNotFoundError extends DomainError {
  constructor() {
    super('Subscription not found', 404);
  }
}
