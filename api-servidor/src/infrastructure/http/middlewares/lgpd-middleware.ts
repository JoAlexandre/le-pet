import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth-middleware';
import { lgpdLogger } from '../../../shared/logger/lgpd-logger';

function resolveUser(req: AuthenticatedRequest): Record<string, unknown> | null {
  if (req.user) {
    return { sub: req.user.sub, email: req.session.email, role: req.user.role };
  }

  if (req.session?.userId) {
    return { sub: req.session.userId, email: req.session.email, role: req.session.role };
  }

  return null;
}

export function lgpdMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  const startTime = Date.now();

  res.on('finish', () => {
    const durationMs = Date.now() - startTime;

    const requestData: Record<string, unknown> = {};

    if (req.body && Object.keys(req.body as object).length > 0) {
      requestData.body = req.body;
    }

    if (req.params && Object.keys(req.params).length > 0) {
      requestData.params = req.params;
    }

    if (req.query && Object.keys(req.query).length > 0) {
      requestData.query = req.query;
    }

    lgpdLogger.info({
      message: 'request_log',
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs,
      user: resolveUser(req),
      origin: {
        ip: req.ip,
        userAgent: req.get('user-agent'),
        origin: req.get('origin') || req.get('referer'),
      },
      data: requestData,
    });
  });

  next();
}
