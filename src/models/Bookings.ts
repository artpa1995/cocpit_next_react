
import { DataTypes, Model } from 'sequelize';
import sequelize from './index';
import internal from 'stream';

class Bookings extends Model {
  public id!: internal;
  public user_id!: number; 
  public client_id!: internal;
  public service_id!: internal;
  public ltv!: internal;
  public status!: internal;
  public date!: Date; 
}

Bookings.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false, 
    },
    client_id: {
        type: DataTypes.INTEGER,
        allowNull: false, 
    },
    service_id: {
        type: DataTypes.INTEGER,
        allowNull: true, 
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
    },
    ltv: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Bookings',
    tableName: 'bookings', 
    timestamps: true, 
  }
);

export default Bookings;
