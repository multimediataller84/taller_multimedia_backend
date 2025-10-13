import {
  Model,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
} from "sequelize";
import { sequelize } from "../../../../database/connection.js";
import type { TStatus } from "../types/TStatus.js";
import type Invoice from "../../../Invoice/domain/models/InvoiceModel.js";
import type User from "../../../User/domain/models/UserModel.js";

class CashRegister extends Model<
  InferAttributes<CashRegister>,
  InferCreationAttributes<CashRegister>
> {
  declare id: CreationOptional<number>;
  declare opened_at: CreationOptional<Date>;
  declare closed_at: Date | null;
  declare opening_amount: number;
  declare amount: number;
  declare closing_amount: number | null;
  declare status: TStatus;
  declare user_id: number | null;
  declare user?: User;
  declare invoices?: Invoice[];
}

CashRegister.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    opened_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    closed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    opening_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00
    },
    closing_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("open", "closed"),
      allowNull: false,
      defaultValue: "closed",
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
  },
  {
    sequelize,
    modelName: "CashRegister",
    tableName: "cash_registers",
    timestamps: false,
  }
);

export default CashRegister;
