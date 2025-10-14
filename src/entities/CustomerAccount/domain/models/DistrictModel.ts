import {
  Model,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  type ForeignKey,
} from "sequelize";
import { sequelize } from "../../../../database/connection.js";
import Canton from "./CantonModel.js";

class District extends Model<
  InferAttributes<District>,
  InferCreationAttributes<District>
> {
  declare id: number;
  declare name: string;
  declare cantonId: ForeignKey<Canton["id"]>;
}

District.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cantonId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: "canton_id",
      references: {
        model: "cantons",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "District",
    tableName: "districts",
    timestamps: false,
  }
);

export default District;
