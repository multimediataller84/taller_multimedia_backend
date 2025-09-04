import {
  Model,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
} from "sequelize";
import { sequelize } from "../../../../database/connection.js";
import Customer from "../../../CustomerAccount/domain/models/CustomerModel.js";
import Invoice from "../../../Invoice/domain/models/InvoiceModel.js";
import CreditPayment from "../../../CreditPayment/domain/models/CreditPaymentModel.js";
import type { TCreditStatus } from "../types/TCreditStatus.js";

class Credit extends Model<InferAttributes<Credit>, InferCreationAttributes<Credit>> {
  declare id: CreationOptional<number>;
  declare invoice_id: number;
  declare customer_id: number;
  declare credit_amount: number;
  declare balance: number;
  declare due_date: Date;
  declare status: TCreditStatus;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Credit.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    invoice_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: "invoices",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    customer_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: "customers",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    credit_amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    balance: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    due_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Pending", "Partial", "Canceled"),
      allowNull: false,
      defaultValue: "Pending",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "updated_at",
    },
  },
  {
    sequelize,
    modelName: "Credit",
    tableName: "credits",
    timestamps: true,
  }
);

export default Credit;
