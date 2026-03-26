import { DomainError } from '../../shared/errors';

export class LostAnimalMediaLimitError extends DomainError {
  constructor() {
    super('Maximum of 2 photos and 1 video per lost animal post', 400);
  }
}
