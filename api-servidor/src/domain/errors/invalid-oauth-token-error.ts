import { DomainError } from '../../shared/errors';

export class InvalidOAuthTokenError extends DomainError {
  constructor() {
    super('Invalid OAuth token', 401);
  }
}
