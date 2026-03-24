import { Request, Response, NextFunction } from 'express';
import { DomainError } from '../../../shared/errors';
import { logger } from '../../../shared/logger';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof DomainError) {
    logger.info('Unhandled error', err);
    res.status(err.statusCode).json({
      error: err.name,
      message: err.message,
    });
    return;
  }

  logger.info('Unhandled error', err);

  res.status(500).json({
    error: 'InternalServerError',
    message: 'An unexpected error occurred',
  });
}
