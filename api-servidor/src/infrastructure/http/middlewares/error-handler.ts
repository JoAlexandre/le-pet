import { Request, Response, NextFunction } from 'express';
import { DomainError } from '../../../shared/errors';
import { logger } from '../../../shared/logger';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof DomainError) {
    const level = err.statusCode >= 500 ? 'error' : 'warn';
    logger[level](`${err.name}: ${err.message}`, { statusCode: err.statusCode });
    res.status(err.statusCode).json({
      error: err.name,
      message: err.message,
    });
    return;
  }

  logger.error(`UnhandledError: ${err.message}`, { statusCode: 500, stack: err.stack });

  res.status(500).json({
    error: 'InternalServerError',
    message: 'An unexpected error occurred',
  });
}
