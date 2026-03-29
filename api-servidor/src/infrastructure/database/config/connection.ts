import { Sequelize } from 'sequelize';
import { config } from '../../../shared/config';

const sequelize = new Sequelize(config.db.name!, config.db.user!, config.db.password, {
  host: config.db.host,
  port: config.db.port,
  dialect: 'mysql',
  logging: config.nodeEnv === 'development' ? true : false,
  define: {
    timestamps: true,
    underscored: true,
  },
});

export { sequelize };
