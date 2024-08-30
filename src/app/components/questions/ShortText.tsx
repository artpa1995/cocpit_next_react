import React from 'react';

interface QuestionOption {
  id: number;
  option: string;
  question_id: number;
}

interface QuestionData {
  id: number;
  question: string;
  type: number;
  is_required: boolean;
  QuestionOptions?: QuestionOption[];
}

interface ShortTextProps {
  questionData: QuestionData;
  onChange: (questionId: number, value: string) => void;
  borderClass?: string;
}

const ShortText: React.FC<ShortTextProps> = ({ questionData, onChange, borderClass = '' }) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(questionData.id, e.target.value); // Возвращаем questionId и значение
  };

  return (
    <div className={`flex flex-col space-y-5 rounded-lg px-5 py-3 border ${borderClass} mt-5`}>
      <label>
        {questionData.question}
        {questionData.is_required && <span style={{ color: 'red' }}>*</span>} {/* Звездочка для обязательного вопроса */}
      </label>
      <input
        type="text"
        placeholder=""
        onChange={handleChange}
        required={questionData.is_required}
        className="rounded-lg px-3 py-2 border border-gray-600"
      />
    </div>
  );
};

export default ShortText;
