import { App } from './app';
import { config } from '../../shared/config';
import { logger } from '../../shared/logger';
import { sequelize } from '../database/config/connection';
import '../database/models';
import { SyncOptions } from 'sequelize';

export async function startServer(): Promise<void> {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established');
    await sequelize.sync({alter: true});
    logger.info('Database models synchronized');
  } catch (error) {
    logger.warn('Database unavailable - server starting without DB', error);
  }

  const { app } = new App();

  app.listen(config.port, () => {
    logger.info(`Server running on port ${config.port}`);
  });
}
