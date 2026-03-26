import { DomainError } from '../../shared/errors';

export class LostAnimalNotFoundError extends DomainError {
  constructor() {
    super('Lost animal post not found', 404);
  }
}
