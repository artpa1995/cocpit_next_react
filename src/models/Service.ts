import { DataTypes, Model } from 'sequelize';
import sequelize from './index';

class Service extends Model {
    public id!: number;
    public user_id!: number; 
    public title?: string | null;
    public status?: number | null;
    public type?: number | null;
    public price?: number | null;
    public currency?: number | null;
    public createdAt!: Date; 
    public updatedAt!: Date;
}

Service.init(
    {
        id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        },
        user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id',
        },
        onDelete: 'CASCADE',
        },
        type: {
        type: DataTypes.STRING,
        allowNull: true,
        },
        price: {
        type: DataTypes.INTEGER,
        allowNull: true,
        },
        currency: {
        type: DataTypes.INTEGER,
        allowNull: true,
        },
        createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
        },
        updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        modelName: 'Service',
        tableName: 'services', 
        timestamps: true, 
    }
);

export default Service;
