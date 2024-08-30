import { DataTypes, Model } from 'sequelize';
import sequelize from './index';


class PageData extends Model {
  public id!: number;
  public page_id!: number | null;
  public page_key!: string;
  public page_value!: string;
}

PageData.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
    page_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    page_key: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    page_value: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    
  },
  {
    sequelize,
    modelName: 'PageData',
    tableName: 'page_data',
    timestamps: false, 
  }
);

export default PageData;
