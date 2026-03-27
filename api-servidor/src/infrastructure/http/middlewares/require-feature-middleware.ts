import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth-middleware';
import { QuotaService } from '../../../domain/services/quota-service';
import { Role } from '../../../domain/enums/role';
import { DomainError } from '../../../shared/errors';

export function requireFeature(quotaService: QuotaService, feature: string) {
  return async (
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user || !req.user.role) {
        throw new DomainError('Access denied: role not assigned', 403);
      }

      const hasAccess = await quotaService.hasFeature(
        req.user.sub,
        req.user.role as Role,
        feature,
      );

      if (!hasAccess) {
        throw new DomainError(
          `Access denied: feature "${feature}" is not available on your current plan. Upgrade your plan to access this feature.`,
          403,
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
