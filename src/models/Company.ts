import { DataTypes, Model } from 'sequelize';
import CompanyUserRelation from './CompanyUserRelation'
import sequelize from './index';

class Company extends Model {
    public id!: number;
    public user_id!: number; 
    public title?: string | null;
    public status?: number | null;
    public type?: number | null;
    public sub_type?: number | null;
    public date!: Date; 
    public state?: string | null;
    public city?: string | null; 
    public industry?: string | null; 
    public country?: string | null;
    public createdAt!: Date; 
    public updatedAt!: Date;
}

Company.init(
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
        title: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false, 
            defaultValue: 1,
        },
        industry: {
            type: DataTypes.STRING,
            allowNull: true, 
        },
        type: {
            type: DataTypes.INTEGER,
            allowNull: true, 
        },
        revenue: {
            type: DataTypes.INTEGER,
            allowNull: true, 
        },
        employees: {
            type: DataTypes.INTEGER,
            allowNull: true, 
        },
        employees_count: {
            type: DataTypes.INTEGER,
            allowNull: true, 
        },
        state: {
            type: DataTypes.STRING,
            allowNull: true, 
        },
        city: {
            type: DataTypes.STRING,
            allowNull: true, 
        },
        country: {
            type: DataTypes.STRING,
            allowNull: true, 
        },
    },
    {
        sequelize,
        modelName: 'Company',
        tableName: 'company', 
        timestamps: true, 
    }
);

Company.hasMany(CompanyUserRelation, { foreignKey: 'company_id', sourceKey: 'id' });
CompanyUserRelation.belongsTo(Company, { foreignKey: 'company_id' });

export default Company;
