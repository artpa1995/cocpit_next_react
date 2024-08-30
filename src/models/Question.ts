import { DataTypes, Model } from 'sequelize';
import sequelize from './index';
import QuestionOption from './QuestionOption';

class Question extends Model {
  public id!: number;
  public queue!: number | null;
  public question!: string;
  public type!: number | null;
  public is_required!: boolean | null;
}

// Определение модели
Question.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
    queue: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    is_required: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    question: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Question',
    tableName: 'questions',
  }
);

// Ассоциация с QuestionOption
// QuestionOption.belongsTo(Question, { foreignKey: 'question_id', targetKey: 'id' }); 
Question.hasMany(QuestionOption, { foreignKey: 'question_id', sourceKey: 'id' });

export default Question;
