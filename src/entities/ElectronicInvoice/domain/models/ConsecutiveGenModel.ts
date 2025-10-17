import {
  Model,
  DataTypes,
  type InferAttributes,
  type CreationOptional,
  type InferCreationAttributes,
} from "sequelize";
import { sequelize } from "../../../../database/connection.js";

class Consecutive extends Model<
  InferAttributes<Consecutive>,
  InferCreationAttributes<Consecutive>
> {
  declare id: CreationOptional<number>;
  declare sucursal: string;
  declare terminal: string;
  declare tipo: string;
  declare secuencia_actual: number;
}

Consecutive.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sucursal: {
      type: DataTypes.STRING(3),
      allowNull: false,
      validate: {
        len: [3, 3],
        isNumeric: true,
      },
    },
    terminal: {
      type: DataTypes.STRING(2),
      allowNull: false,
      validate: {
        len: [2, 2],
        isNumeric: true,
      },
    },
    tipo: {
      type: DataTypes.STRING(2),
      allowNull: false,
      validate: {
        len: [2, 2],
        isNumeric: true,
      },
    },
    secuencia_actual: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 9999999999999,
      },
    },
  },
  {
    sequelize,
    tableName: "consecutivos",
    indexes: [
      {
        unique: true,
        fields: ["sucursal", "terminal", "tipo"],
      },
    ],
    underscored: true, 
    timestamps: true,
  }
);

export default Consecutive;
