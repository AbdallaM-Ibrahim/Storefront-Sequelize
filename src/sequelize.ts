import { Dialect, Sequelize } from 'sequelize';
import { config } from './config/config';

export const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.db_port,
    dialect: config.driver as Dialect,
    logging: false,
    dialectOptions: {
      ssl: true
    }
  }
);
