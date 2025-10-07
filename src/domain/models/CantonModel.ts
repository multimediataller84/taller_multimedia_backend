import {
  Model,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
  type ForeignKey,
} from "sequelize";
import { sequelize } from "../../database/connection.js";
import Province from "./ProvinceModel.js";

class Canton extends Model<
  InferAttributes<Canton>,
  InferCreationAttributes<Canton>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare provinceId: ForeignKey<Province["id"]>;
}

Canton.init(
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
    provinceId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: "province_id",
      references: {
        model: "provinces",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "Canton",
    tableName: "cantons",
    timestamps: false,
  }
);

export default Canton;
