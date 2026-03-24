import { Request, Response, NextFunction } from 'express';
import { DomainError } from '../../../shared/errors';

type ValidationSchema = {
  [key: string]: {
    required?: boolean;
    type?: string;
    enum?: string[];
  };
};

export function validationMiddleware(schema: ValidationSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const errors: string[] = [];

    const body = req.body as Record<string, unknown>;

    for (const [field, rules] of Object.entries(schema)) {
      const value = body[field];

      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push(`${field} is required`);
        continue;
      }

      if (value !== undefined && value !== null) {
        if (rules.type && typeof value !== rules.type) {
          errors.push(`${field} must be of type ${rules.type}`);
        }

        if (rules.enum && !rules.enum.includes(value as string)) {
          errors.push(`${field} must be one of: ${rules.enum.join(', ')}`);
        }
      }
    }

    if (errors.length > 0) {
      throw new DomainError(errors.join('; '), 400);
    }

    next();
  };
}
