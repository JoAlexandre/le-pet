import { DomainError } from '../../shared/errors';

export class InvalidPlanChangeError extends DomainError {
  constructor(reason?: string) {
    super(reason || 'Invalid plan change request', 400);
  }
}
