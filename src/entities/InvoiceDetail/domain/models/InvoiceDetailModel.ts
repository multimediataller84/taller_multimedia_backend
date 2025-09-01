import {
  Model,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
} from "sequelize";
import { sequelize } from "../../../../database/connection.js";

class InvoiceDetail extends Model<InferAttributes<InvoiceDetail>, InferCreationAttributes<InvoiceDetail>> {
  declare id: CreationOptional<number>;
  declare invoice_id: number;
  declare product_id: number;
  declare quantity: number;
  declare unit_price: number;
  declare discount: number;
  declare subtotal: number;
}

InvoiceDetail.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    invoice_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    unit_price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    discount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
    subtotal: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "InvoiceDetail",
    tableName: "invoice_details",
    timestamps: false,
  }
);

export default InvoiceDetail;

