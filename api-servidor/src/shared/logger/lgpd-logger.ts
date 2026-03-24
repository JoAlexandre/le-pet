import winston from 'winston';
import path from 'path';

const { combine, timestamp, json } = winston.format;

export const lgpdLogger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    json(),
  ),
  transports: [
    new winston.transports.File({
      filename: path.resolve(process.cwd(), 'logs', 'lgpd.log'),
      maxsize: 10 * 1024 * 1024,
      maxFiles: 5,
    }),
  ],
});
