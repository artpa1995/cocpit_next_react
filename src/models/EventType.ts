import { DataTypes, Model } from 'sequelize';
import sequelize from './index';

class EventType extends Model {
    public id!: number;
    public type?: string | null;
}

EventType.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            autoIncrement: true,
            primaryKey: true,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: true, 
        },
    },
    {
        sequelize,
        modelName: 'EventType',
        tableName: 'event_type', 
        timestamps: false, 
    }
);

export default EventType;
