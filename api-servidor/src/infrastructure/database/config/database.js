require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER_DEV,
    password: process.env.DB_PASSWORD_DEV,
    database: process.env.DB_NAME_DEV,
    host: process.env.DB_HOST_DEV,
    port: parseInt(process.env.DB_PORT_DEV),
    dialect: 'mysql',
    logging: process.env.SQL_DEBUG === 'true' ? console.log : false, // Habilita log SQL se SQL_DEBUG=true
    pool: {
      max: parseInt(process.env.DB_POOL_MAX_DEV), // Aumentado de 10 para 20
      min: parseInt(process.env.DB_POOL_MIN_DEV),  // Aumentado de 2 para 5
      acquire: parseInt(process.env.DB_POOL_ACQUIRE_DEV),
      idle: parseInt(process.env.DB_POOL_IDLE_DEV),
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    },
    // Otimizações de performance
    benchmark: false, // Desabilita logging de benchmark em dev
    dialectOptions: {
      connectTimeout: 60000,
      // Otimizações MySQL
      decimalNumbers: true,
      supportBigNumbers: true,
      bigNumberStrings: false,
    },
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306', 10),
    dialect: 'mysql',
    define: {
      timestamps: true,
      underscored: true,
    },
    logging: false,
  },
};
