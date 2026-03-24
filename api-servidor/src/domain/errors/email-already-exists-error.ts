import { DomainError } from '../../shared/errors';

export class EmailAlreadyExistsError extends DomainError {
  constructor() {
    super('Email already exists', 409);
  }
}
