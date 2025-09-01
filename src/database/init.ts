import { sequelize } from "./connection.js";
import User from "../entities/User/domain/models/UserModel.js";
import Role from "../entities/Role/domain/models/RoleModel.js";

export const initDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("successfully connected");
    //asociaciones
    Role.hasMany(User, { foreignKey: "roleId", as: "users" });
    User.belongsTo(Role, { foreignKey: "roleId", as: "roleEntity" });
    await sequelize.sync({ alter: true });
  } catch (err) {
    console.error("DB connection error:", err);
  }
};