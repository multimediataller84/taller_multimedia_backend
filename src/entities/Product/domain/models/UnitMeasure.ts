import {
  Model,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
} from "sequelize";
import { sequelize } from "../../../../database/connection.js";

class UnitMeasure extends Model<
  InferAttributes<UnitMeasure>,
  InferCreationAttributes<UnitMeasure>
> {
  declare id: CreationOptional<number>;
  declare symbol: string;
  declare description: string;
}

UnitMeasure.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    symbol: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "UnitMeasure",
    tableName: "unit_measures",
    timestamps: false,
  }
);

export default UnitMeasure;
