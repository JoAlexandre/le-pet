import winston from 'winston';
import { config } from '../config';

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return stack
    ? `${String(timestamp)} [${String(level)}]: ${String(message)}\n${String(stack)}`
    : `${String(timestamp)} [${String(level)}]: ${String(message)}`;
});

export const logger = winston.createLogger({
  level: config.nodeEnv === 'production' ? 'info' : 'debug',
  format: combine(errors({ stack: true }), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })),
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), logFormat),
    }),
  ],
});
