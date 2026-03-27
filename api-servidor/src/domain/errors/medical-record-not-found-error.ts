import { DomainError } from '../../shared/errors';

export class MedicalRecordNotFoundError extends DomainError {
  constructor() {
    super('Medical record not found', 404);
  }
}
