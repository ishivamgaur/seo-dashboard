import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2';
import { config } from './environment.js';

// Explicitly provide mysql2 to ensure reliable connection handling under ESM
const sequelize = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: 'mysql',
    dialectModule: mysql2,
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    },
  }
);

export const testConnection = async () => {
  await sequelize.authenticate();
};

export { sequelize };
export default sequelize;
