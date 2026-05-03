/**
 * Interface do Logger
 * Define o contrato para serviços de logging na aplicação
 */
export interface ILogger {
  info(message: string, meta?: any): void;
  error(message: string, meta?: any): void;
  warn(message: string, meta?: any): void;
  debug(message: string, meta?: any): void;
}
