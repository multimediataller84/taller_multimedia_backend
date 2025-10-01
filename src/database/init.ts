import { sequelize } from "./connection.js";
import { setupAssociations } from "../associations/associations.js";

export const initDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("successfully connected");
    setupAssociations();
    await sequelize.sync({ alter: false });
  } catch (err) {
    console.error("DB connection error:", err);
  }
};