import {
  Model,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
} from "sequelize";
import { sequelize } from "../../../../database/connection.js";

class Province extends Model<
  InferAttributes<Province>,
  InferCreationAttributes<Province>
> {
  declare id: CreationOptional<number>;
  declare name: string;
}

Province.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Province",
    tableName: "provinces",
    timestamps: false,
  }
);

export default Province;
