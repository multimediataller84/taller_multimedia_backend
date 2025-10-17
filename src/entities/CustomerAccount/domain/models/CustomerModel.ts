import {
  Model,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
} from "sequelize";
import { sequelize } from "../../../../database/connection.js";
import type Credit from "../../../Credit/domain/models/CreditModel.js";
import type Invoice from "../../../Invoice/domain/models/InvoiceModel.js";
import type Province from "./ProvinceModel.js";
import type Canton from "./CantonModel.js";
import type District from "./DistrictModel.js";
import type { TIdentificationType } from "../types/TIdentificationType.js";

class Customer extends Model<
  InferAttributes<Customer>,
  InferCreationAttributes<Customer>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare last_name: string;
  declare address: string;
  declare id_number: string;
  declare email: string;
  declare phone: number;
  declare province_id: number;
  declare canton_id: number;
  declare district_id: number;
  declare identification_type: TIdentificationType;
  declare province?: Province;
  declare canton?: Canton;
  declare district?: District;
  declare credit?: Credit;
  declare invoices?: Invoice[];
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Customer.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    identification_type: {
      type: DataTypes.ENUM("Cédula Física", "Cédula Jurídica", "DIMEX", "NITE", "Extranjero no domiciliado"),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    province_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: "provinces",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    canton_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: "cantons",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    district_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: "districts",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
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
    modelName: "Customer",
    tableName: "customers",
    timestamps: true,
  }
);

export default Customer;
