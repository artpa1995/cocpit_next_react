import { DataTypes, Model } from 'sequelize';
import sequelize from './index';
import Clients from './Clients';

class CompanyUserRelation extends Model {
  public id!: number;
  public user_id!: number; 
  public coach_id?: string | null;
  public company_id!: Date; 
  public createdAt!: Date; 
  public updatedAt!: Date;
}

CompanyUserRelation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
    coach_id: {
        type: DataTypes.INTEGER,
        allowNull: false, 
      },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false, 
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: true, 
    }
  },
  {
    sequelize,
    modelName: 'CompanyUserRelation',
    tableName: 'company_user_relation', 
    timestamps: true, 
  }
);

CompanyUserRelation.belongsTo(Clients, { foreignKey: 'client_id' });
Clients.hasMany(CompanyUserRelation, { foreignKey: 'client_id', sourceKey: 'id' });

export default CompanyUserRelation;
