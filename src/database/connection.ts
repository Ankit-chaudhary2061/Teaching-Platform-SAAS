import { Sequelize } from "sequelize-typescript";
import type { Dialect } from "sequelize";
import User from "./model/userModels.ts";

const dialect: Dialect = (process.env.DB_DIALECT as Dialect) || 'mysql';

const sequelize = new Sequelize({
  database: process.env.DB_NAME || 'teaching-pathsala',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  host: process.env.DB_HOST || 'localhost',
  dialect,
  port: Number(process.env.DB_PORT) || 3306,
  models: [User] // model is attached
})

// Log loaded models after initialization
console.log('Loaded models:', sequelize.models);

sequelize.authenticate()
  .then(() => {
    console.log('Authenticated successfully, connected');
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });

sequelize.sync({ alter: false }).then(() => {
  console.log('Database synced successfully, new changes applied');
});

export default sequelize;
