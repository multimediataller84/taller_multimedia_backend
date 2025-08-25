import { sequelize } from "./connection.js";

export const initDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("successfully connected");
    await sequelize.sync({ alter: true });
  } catch (err) {
    console.error("DB connection error:", err);
  }
};