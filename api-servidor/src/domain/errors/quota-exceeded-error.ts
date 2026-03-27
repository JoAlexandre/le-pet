import { DomainError } from '../../shared/errors';

export class QuotaExceededError extends DomainError {
  constructor(feature: string, limit: number, currentCount?: number) {
    const countInfo = currentCount !== undefined ? ` (current: ${currentCount}/${limit})` : '';
    super(
      `Quota exceeded for "${feature}"${countInfo}. ` +
        'Consider upgrading your plan for higher limits.',
      403,
    );
  }
}
