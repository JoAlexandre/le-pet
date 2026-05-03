import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth-middleware';
import { logger } from '../../../shared/logger/lgpd-logger';

const SENSITIVE_FIELDS = ['password', 'token', 'accessToken', 'refreshToken', 'secret', 'apiKey'];

function sanitizeBody(body: unknown): unknown {
  if (!body || typeof body !== 'object') return body;

  const sanitized = { ...(body as Record<string, unknown>) };

  for (const field of SENSITIVE_FIELDS) {
    if (sanitized[field]) {
      sanitized[field] = '***REDACTED***';
    }
  }

  return sanitized;
}

function resolveIp(req: AuthenticatedRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return (Array.isArray(forwarded) ? forwarded[0] : forwarded).split(',')[0].trim();
  }
  const realIp = req.headers['x-real-ip'];
  if (realIp) return Array.isArray(realIp) ? realIp[0] : realIp;
  return req.socket?.remoteAddress ?? req.ip ?? 'unknown';
}

function resolveUser(req: AuthenticatedRequest): Record<string, unknown> {
  if (req.user) {
    return { sub: req.user.sub, role: req.user.role ?? 'unknown' };
  }
  if (req.session?.userId) {
    return { sub: req.session.userId, role: req.session.role ?? 'unknown' };
  }
  return { sub: 'anonymous', role: 'unknown' };
}

function extractErrorMessage(responseBody: unknown): string | null {
  if (!responseBody) return null;

  if (typeof responseBody === 'string') {
    try {
      const parsed = JSON.parse(responseBody) as Record<string, unknown>;
      return (parsed?.error ?? parsed?.message ?? null) as string | null;
    } catch {
      return null;
    }
  }

  if (typeof responseBody === 'object') {
    const body = responseBody as Record<string, unknown>;
    return (body?.error ?? body?.message ?? null) as string | null;
  }

  return null;
}

export function lgpdMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  const startTime = Date.now();
  const ip = resolveIp(req);

  let responseBody: unknown = null;

  const originalSend = res.send.bind(res);
  const originalJson = res.json.bind(res);

  res.send = function (data: unknown): Response {
    responseBody = data;
    return originalSend(data);
  };

  res.json = function (data: unknown): Response {
    responseBody = data;
    return originalJson(data);
  };

  const logRequest = (): void => {
    const durationMs = Date.now() - startTime;
    const { statusCode } = res;
    const logLevel = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';

    logger[logLevel](`[LGPD] ${req.method} ${req.path} - ${statusCode}`, {
      usuario: resolveUser(req),
      requisicao: {
        method: req.method,
        url: req.originalUrl,
        path: req.path,
        ip,
        userAgent: req.get('user-agent') ?? 'unknown',
        origin: req.get('origin') ?? req.get('referer') ?? null,
      },
      dados: {
        body: sanitizeBody(req.body),
        params: req.params,
        query: req.query,
      },
      resposta: {
        statusCode,
        statusMessage: res.statusMessage ?? null,
        errorMessage: extractErrorMessage(responseBody),
        durationMs,
      },
    });
  };

  res.once('finish', logRequest);

  res.once('close', () => {
    if (!res.writableEnded) {
      const durationMs = Date.now() - startTime;

      logger.warn(`[LGPD] ${req.method} ${req.path} - INTERRUPTED`, {
        usuario: resolveUser(req),
        requisicao: {
          method: req.method,
          url: req.originalUrl,
          path: req.path,
          ip,
        },
        dados: {
          body: sanitizeBody(req.body),
          params: req.params,
          query: req.query,
        },
        resposta: {
          statusCode: res.statusCode ?? 0,
          durationMs,
          interrupted: true,
        },
      });
    }
  });

  next();
}
