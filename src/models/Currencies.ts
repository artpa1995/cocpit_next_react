import { DataTypes, Model } from 'sequelize';
import sequelize from './index';

class Currencies extends Model {
  public id!: number;
  public name!: string;
  public icon!: string;
}

Currencies.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    icon: {
        type: DataTypes.STRING,
        allowNull: true,
      },
  },
  {
    sequelize,
    modelName: 'Currencies',
    tableName: 'currencies',
    timestamps: false, 
  }
);

export default Currencies;
