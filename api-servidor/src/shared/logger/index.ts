import path from 'path';
import winston from 'winston';
import { config } from '../config';

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack, statusCode, ...meta }) => {
  const statusPart = statusCode !== undefined ? ` (${String(statusCode)})` : '';
  const metaKeys = Object.keys(meta).filter((k) => k !== 'service');
  const metaStr = metaKeys.length > 0 ? ` ${JSON.stringify(meta)}` : '';
  return stack
    ? `${String(timestamp)} [${String(level)}]${statusPart}: ${String(message)}\n${String(stack)}`
    : `${String(timestamp)} [${String(level)}]${statusPart}: ${String(message)}${metaStr}`;
});

export const logger = winston.createLogger({
  level: config.nodeEnv === 'production' ? 'info' : 'debug',
  format: combine(errors({ stack: true }), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })),
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), logFormat),
    }),
    new winston.transports.File({
      filename: path.resolve(process.cwd(), 'logs', 'error.log'),
      level: 'error',
      format: combine(errors({ stack: true }), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston.format.json()),
      maxsize: 10 * 1024 * 1024,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.resolve(process.cwd(), 'logs', 'combined.log'),
      format: combine(errors({ stack: true }), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston.format.json()),
      maxsize: 10 * 1024 * 1024,
      maxFiles: 10,
    }),
  ],
});
