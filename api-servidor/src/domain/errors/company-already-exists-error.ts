import { DomainError } from '../../shared/errors';

export class CompanyAlreadyExistsError extends DomainError {
  constructor() {
    super('User already has a registered company', 409);
  }
}
