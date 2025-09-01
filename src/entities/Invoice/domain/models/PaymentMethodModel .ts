import {
  Model,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
} from "sequelize";
import { sequelize } from "../../../../database/connection.js";
import type { TPaymentMethod } from "../types/TPaymentMethod.js";

class PaymentMethod extends Model<InferAttributes<PaymentMethod>, InferCreationAttributes<PaymentMethod>> {
  declare id: CreationOptional<number>;
  declare method_name: TPaymentMethod;
}

PaymentMethod.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    method_name: {
      type: DataTypes.ENUM("Cash", "Credit", "Debit Card", "Transfer"),
      allowNull: false,
    }
  },
  {
    sequelize,
    modelName: "PaymentMethod",
    tableName: "payment_methods",
    timestamps: false,
  }
);

export default PaymentMethod;
