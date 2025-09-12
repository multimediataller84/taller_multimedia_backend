import {
  Model,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
} from "sequelize";
import { sequelize } from "../../../../database/connection.js";
import type { TPaymentMethodTypes } from "../types/TPaymentMethodTypes.js";

class PaymentMethod extends Model<
  InferAttributes<PaymentMethod>,
  InferCreationAttributes<PaymentMethod>
> {
  declare id: CreationOptional<number>;
  declare name: TPaymentMethodTypes;
  declare description: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

PaymentMethod.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.ENUM("cash", "card", "transfer", "mobile", "check"),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "created_at",
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "updated_at",
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "PaymentMethod",
    tableName: "payment_methods",
    timestamps: true,
  }
);

export default PaymentMethod;
