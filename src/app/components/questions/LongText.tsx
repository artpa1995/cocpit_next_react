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

interface LongTextProps {
  questionData: QuestionData;
  onChange: (id: number, value: string) => void;
  borderClass?: string;
}

const LongText: React.FC<LongTextProps> = ({ questionData, onChange, borderClass = '' }) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(questionData.id, e.target.value);
  };

  return (
    <div className={`flex flex-col space-y-5 rounded-lg px-5 py-3 border ${borderClass} mt-5`}>
      <label>
        {questionData.question}
        {questionData.is_required && <span style={{ color: 'red' }}>*</span>}
      </label>
      <textarea
        placeholder=""
        onChange={handleChange}
        required={questionData.is_required}
        className="rounded-lg px-3 py-2 border border-gray-600 w-full h-32"
      />
    </div>
  );
};

export default LongText;
