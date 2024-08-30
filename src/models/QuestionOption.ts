import { DataTypes, Model } from 'sequelize';
import sequelize from './index';
import internal from 'stream';
// import Question from './Question';

class QuestionOption extends Model {
  public id!: number;
  public question_id!: number;
  public option?: string | null;
  public createdAt!: Date;
  public updatedAt!: Date;
}

QuestionOption.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
    question_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    option: {
      type: DataTypes.STRING,
      allowNull: true,
    },

  },
  {
    sequelize,
    modelName: 'QuestionOption',
    tableName: 'question_options',
    timestamps: true,
  }
);

// QuestionOption.belongsTo(Question, { foreignKey: 'question_id', as: 'question' });

export default QuestionOption;
