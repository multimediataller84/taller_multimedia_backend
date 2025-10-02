import {
  Model,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
} from "sequelize";
import { sequelize } from "../../../../database/connection.js";
import type { TCreditStatus } from "../types/TCreditStatus.js";
import type Customer from "../../../CustomerAccount/domain/models/CustomerModel.js";
import type CreditPayment from "../../../CreditPayment/domain/models/CreditPaymentModel.js";

class Credit extends Model<
  InferAttributes<Credit>,
  InferCreationAttributes<Credit>
> {
  declare id: CreationOptional<number>;
  declare customer_id: number;
  declare approved_credit_amount: number;
  declare balance: number;
  declare status: TCreditStatus;
  declare customer?: Customer;
  declare payments?: CreditPayment[];
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
    customer_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: "customers",
        key: "id",
      },
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    },
    approved_credit_amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    balance: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Pending", "Aproved", "Revoked"),
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
