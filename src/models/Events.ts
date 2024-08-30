import { DataTypes, Model } from 'sequelize';
import EventType from './EventType'
import sequelize from './index';

class Events extends Model {
    public id!: number;
    public user_id!: number; 
    public title?: string | null;
    public status?: number | null;
    public type?: number | null;
    public sub_type?: number | null;
    public date!: Date; 
    public createdAt!: Date; 
    public updatedAt!: Date;
}

Events.init(
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
        type: {
            type: DataTypes.INTEGER,
            allowNull: true, 
        },
        sub_type_id: {
            type: DataTypes.INTEGER,
            allowNull: true, 
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Events',
        tableName: 'events', 
        timestamps: true, 
    }
);

// Events.hasOne(EventType, { foreignKey: 'type', sourceKey: 'id' });

EventType.hasMany(Events, { foreignKey: 'type' });
Events.belongsTo(EventType, { foreignKey: 'type' });

export default Events;
