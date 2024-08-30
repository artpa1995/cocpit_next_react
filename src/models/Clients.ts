
import { DataTypes, Model } from 'sequelize';
import sequelize from './index';
import internal from 'stream';
import Bookings from './Bookings'

class Clients extends Model {
  public id!: internal;
  public user_id!: number; 
  public first_name!: string;
  public last_name!: string;
  public email!: string;
  public password!: string;
  public role!: internal;
  public avatar!: string;
  public status!: internal;
  public phone!: string;
  public google_id!: string;
  public source!: internal;
  public source_user_id!: internal;
  public ltv!: internal;
  public type!: internal;
  public estimated_salary!: internal;
  public intention!: string;
  public agreed_meetings!: internal;
  public agreed_meetings_frequency!: internal;
  public billing_type!: internal;
  public positive_impression!: number;
  public how_well_do_they_know_you!: internal;
  public combined_network_rank!: internal;
  public days_since_last_contact!: internal;
  public pronouns!: internal;
  public time_zone!: string;
  public start_date!: Date; 
  public end_date!: Date;
}

Clients.init(
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
    first_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    source: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    source_user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ltv: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    estimated_salary: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    intention: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    agreed_meetings: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    agreed_meetings_frequency: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    billing_type: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    positive_impression: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    how_well_do_they_know_you: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    combined_network_rank: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    days_since_last_contact: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    pronouns: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    time_zone: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'clients',
  }
);

Clients.hasMany(Bookings, { foreignKey: 'client_id', sourceKey: 'id' });
Bookings.belongsTo(Clients, { foreignKey: 'client_id' });

export default Clients;
