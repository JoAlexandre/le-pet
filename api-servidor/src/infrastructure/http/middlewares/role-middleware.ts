import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth-middleware';
import { DomainError } from '../../../shared/errors';
import { Role } from '../../../domain/enums/role';

export function roleMiddleware(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    // ADMIN tem acesso a todas as rotas
    const user = req.user!;
    if (user.role === Role.ADMIN) {
      next();
      return;
    }

    if (!req.user || !req.user.role) {
      throw new DomainError('Access denied: role not assigned', 403);
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new DomainError('Access denied: insufficient permissions', 403);
    }

    next();
  };
}
