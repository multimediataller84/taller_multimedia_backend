import {
  Model,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
  type BelongsToManyAddAssociationMixin,
  type BelongsToManyAddAssociationsMixin,
  type BelongsToManyGetAssociationsMixin,
} from "sequelize";
import { sequelize } from "../../../../database/connection.js";
import type Customer from "../../../CustomerAccount/domain/models/CustomerModel.js";
import Product from "../../../Product/domain/models/ProductModel.js";
import type { ProdutList } from "../types/TInvoice.js";
import type { TInvoiceStatus } from "../types/TInvoiceStatus.js";
import type { TPaymentMethod } from "../../../../domain/types/TPaymentMethod.js";
import type CreditPayment from "../../../CreditPayment/domain/models/CreditPaymentModel.js";
import type CashRegister from "../../../CashRegister/domain/models/CashRegisterModel.js";

class Invoice extends Model<
  InferAttributes<Invoice>,
  InferCreationAttributes<Invoice>
> {
  declare id: CreationOptional<number>;
  declare customer_id: number;
  declare issue_date: Date | null;
  declare due_date: Date | null;
  declare subtotal: number;
  declare tax_total: number;
  declare total: number;
  declare amount_paid: number;
  declare payment_method: TPaymentMethod;
  declare status: TInvoiceStatus;
  declare invoice_number: string;
  declare digital_signature: string | null;
  declare biometric_hash: string | null;
  declare cash_register_id: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare customer?: Customer;
  declare products?: ProdutList[];
  declare payments?: CreditPayment[];
  declare cashRegister?: CashRegister;
  declare addProduct: BelongsToManyAddAssociationMixin<Product, number>;
  declare addProducts: BelongsToManyAddAssociationsMixin<Product, number>;
  declare getProducts: BelongsToManyGetAssociationsMixin<Product>;
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
      allowNull: true,
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
    amount_paid: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    payment_method: {
      type: DataTypes.ENUM("Cash", "Credit", "Debit Card", "Transfer"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Issued", "Pending", "Canceled"),
      allowNull: false,
    },
    invoice_number: {
      type: DataTypes.STRING(512),
      allowNull: false,
      unique: true,
    },
     cash_register_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: "cash_registers",
        key: "id",
      },
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
