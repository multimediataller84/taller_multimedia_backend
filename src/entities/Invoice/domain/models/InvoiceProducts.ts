import {
  Model,
  DataTypes,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize";
import { sequelize } from "../../../../database/connection.js";

class InvoiceProducts extends Model<
  InferAttributes<InvoiceProducts>,
  InferCreationAttributes<InvoiceProducts>
> {
  declare id: CreationOptional<number>;
  declare invoice_id: number;
  declare product_id: number;
  declare quantity: number;
  declare unit_price: number;
  declare subtotal: number;
}

InvoiceProducts.init(
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
      references: { model: "products", key: "id" },
    },
    quantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    unit_price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "InvoiceProducts",
    tableName: "invoice_products",
    timestamps: false,
  }
);

export default InvoiceProducts;
