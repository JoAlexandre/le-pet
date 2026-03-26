import { DomainError } from '../../shared/errors';

export class CrmvNotVerifiedError extends DomainError {
  constructor() {
    super('Access denied: CRMV verification required to register vaccines', 403);
  }
}
