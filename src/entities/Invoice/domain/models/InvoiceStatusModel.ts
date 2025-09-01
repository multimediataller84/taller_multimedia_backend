import {
  Model,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
} from "sequelize";
import { sequelize } from "../../../../database/connection.js";
import type { TInvoiceStatus } from "../types/TInvoiceStatus.js";

class InvoiceStatus extends Model<InferAttributes<InvoiceStatus>, InferCreationAttributes<InvoiceStatus>> {
  declare id: CreationOptional<number>;
  declare status_name: TInvoiceStatus;
}

InvoiceStatus.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    status_name: {
      type: DataTypes.ENUM("Issued", "Pending", "Canceled"),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "InvoiceStatus",
    tableName: "invoice_status",
    timestamps: false,
  }
);

export default InvoiceStatus;
