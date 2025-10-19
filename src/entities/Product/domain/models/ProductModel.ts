import {
  Model,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
} from "sequelize";
import { sequelize } from "../../../../database/connection.js";
import type { TProductStatus } from "../types/TProductStatus.js";
import type UnitMeasure from "./UnitMeasure.js";
import type Tax from "../../../Tax/domain/models/TaxModel.js";

class Product extends Model<
  InferAttributes<Product>,
  InferCreationAttributes<Product>
> {
  declare id: CreationOptional<number>;
  declare product_name: string;
  declare sku: string;
  declare category_id: number;
  declare tax_id: number;
  declare profit_margin: number;
  declare unit_price: number;
  declare unit_measure_id: number;
  declare stock: number;
  declare unit_measure?: UnitMeasure;
  declare tax?: Tax;
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
    unit_measure_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: "unit_measures",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
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
    indexes: [
      {
        fields: ["tax_id"],
      },
    ],
    timestamps: true,
  }
);

export default Product;
