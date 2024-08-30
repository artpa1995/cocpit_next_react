import { DataTypes, Model } from 'sequelize';
import sequelize from './index';

class UserAnswer extends Model {
  public id!: number;
  public user_id!: number; 
  public answers?: string | null;
  public createdAt!: Date; 
  public updatedAt!: Date;
}

UserAnswer.init(
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
    answers: {
      type: DataTypes.STRING,
      allowNull: true, 
    },

  },
  {
    sequelize,
    modelName: 'UserAnswer',
    tableName: 'user_answers', 
    timestamps: true, 
  }
);


export default UserAnswer;
