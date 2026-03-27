import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth-middleware';

export function crmvMiddleware(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): void {
  // if (!req.user || req.user.crmvStatus !== CrmvStatus.VERIFIED) {
  //   throw new DomainError('Access denied: CRMV verification required', 403);
  // }

  next();
}
