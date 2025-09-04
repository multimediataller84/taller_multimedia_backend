import {
  Model,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
} from "sequelize";
import { sequelize } from "../../../../database/connection.js";
import type { TProductStatus } from "../types/TProductStatus.js";

class Product extends Model<
  InferAttributes<Product>,
  InferCreationAttributes<Product>
> {
  declare id: CreationOptional<number>;
  declare product_name: string;
  declare sku: string;
  declare cabys_code: string;
  declare category_id: number;
  declare tax_id: number;
  declare profit_margin: number;
  declare unit_price: number;
  declare stock: number;
  declare state: CreationOptional<TProductStatus>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    product_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    sku: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    cabys_code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    category_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    tax_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    profit_margin: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    unit_price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    state: {
      type: DataTypes.ENUM("Active", "Inactive", "Discontinued"),
      allowNull: false,
      defaultValue: "Active",
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
    modelName: "Product",
    tableName: "products",
    timestamps: true,
  }
);

export default Product;
