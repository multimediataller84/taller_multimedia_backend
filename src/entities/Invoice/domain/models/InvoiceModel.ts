import {
  Model,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
} from "sequelize";
import { sequelize } from "../../../../database/connection.js";

class Invoice extends Model<InferAttributes<Invoice>, InferCreationAttributes<Invoice>> {
  declare id: CreationOptional<number>;
  declare customer_id: number;
  declare issue_date: Date;
  declare due_date: Date | null;
  declare subtotal: number;
  declare tax_total: number;
  declare total: number;
  declare payment_method_id: number;
  declare status_id: number;
  declare invoice_number: string;
  declare digital_signature: string | null;
  declare biometric_hash: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Invoice.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    customer_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    issue_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    due_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    subtotal: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    tax_total: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    payment_method_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    status_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    invoice_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    digital_signature: {
      type: DataTypes.STRING(512),
      allowNull: true,
    },
    biometric_hash: {
      type: DataTypes.STRING(512),
      allowNull: true,
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
    modelName: "Invoice",
    tableName: "invoices",
    timestamps: true,
  }
);

export default Invoice;
