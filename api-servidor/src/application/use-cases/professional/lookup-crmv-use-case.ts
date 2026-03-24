import {
  CrmvValidationProvider,
  CrmvValidationResult,
} from '../../interfaces/crmv-validation-provider';
import { DomainError } from '../../../shared/errors';

export class LookupCrmvUseCase {
  constructor(private crmvValidationProvider: CrmvValidationProvider) {}

  async execute(crmvNumber: string, crmvState: string): Promise<CrmvValidationResult> {
    if (!crmvNumber || !crmvState) {
      throw new DomainError('crmvNumber and crmvState are required', 400);
    }

    if (crmvState.length !== 2) {
      throw new DomainError('crmvState must be a 2-character state abbreviation', 400);
    }

    return this.crmvValidationProvider.validate(crmvNumber, crmvState.toUpperCase());
  }
}
