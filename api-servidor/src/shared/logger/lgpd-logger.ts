import winston from 'winston';
import { ILogger } from '../interfaces/logger.interface';

/**
 * Implementação do Logger usando Winston
 * Centraliza todo o sistema de logging da aplicação
 */
class Logger implements ILogger {
  private logger: winston.Logger;

  constructor() {
    const isProduction = process.env.NODE_ENV === 'production';

    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
      ),
      defaultMeta: { service: 'api-servidor' },
      transports: [
        // Console transport com formatação colorida para desenvolvimento
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(({ timestamp, level, message }) => {
              return `${timestamp} [${level}]: ${message}`;
            })
          ),
        }),
      ],
    });

    // Em produção, adiciona transporte para arquivo
    if (isProduction) {
      this.logger.add(
        new winston.transports.File({ 
          filename: 'logs/audit-error.log', 
          level: 'error' ,
          format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.json()
          )
        })
      );
      this.logger.add(
        new winston.transports.File({ 
          filename: 'logs/audit-combined.log' ,
          format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.json()
          )
        })
      );
      // Log específico para auditoria LGPD
      this.logger.add(
        new winston.transports.File({ 
          filename: 'logs/audit-lgpd.log',
          format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.json()
          )
        })
      );
    }
    
    // Em desenvolvimento, também mantém logs de auditoria
    if (!isProduction) {
      this.logger.add(
        new winston.transports.File({ 
          filename: 'logs/audit-lgpd-dev.log',
          format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.json()
          )
        })
      );
    }
  }

  info(message: string, meta?: any): void {
    this.logger.info(message, meta);
  }

  error(message: string, meta?: any): void {
    this.logger.error(message, meta);
  }

  warn(message: string, meta?: any): void {
    this.logger.warn(message, meta);
  }

  debug(message: string, meta?: any): void {
    this.logger.debug(message, meta);
  }
}

// Exporta uma instância singleton do logger
export const logger = new Logger();
