import { DomainError } from '../../shared/errors';

export class ServiceNotFoundError extends DomainError {
  constructor() {
    super('Service not found', 404);
  }
}
