import { Request, Response, NextFunction } from 'express';
import { tokenProvider } from '../dependencies';
import { DomainError } from '../../../shared/errors';

export interface AuthenticatedRequest extends Request {
  user?: {
    sub: string;
    role?: string | null;
    specialtyType?: string | null;
    crmvStatus?: string | null;
  };
}

export function authMiddleware(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new DomainError('Missing or invalid authorization header', 401);
  }

  const token = authHeader.substring(7);

  try {
    const payload = tokenProvider.verify(token);
    req.user = payload;
    next();
  } catch {
    throw new DomainError('Invalid or expired token', 401);
  }
}
