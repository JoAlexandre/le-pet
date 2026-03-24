import { DomainError } from '../../shared/errors';

export class ProviderMismatchError extends DomainError {
  constructor() {
    super('This email is registered with a different authentication provider', 409);
  }
}
