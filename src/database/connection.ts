import { Sequelize } from "sequelize";
import { config } from "../utilities/config.js";

export const sequelize = new Sequelize(
  config.DATABASE,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    port: Number(config.DB_PORT),
    dialect: "mysql",
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);
