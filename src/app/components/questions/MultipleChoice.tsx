import React, { useState } from 'react';

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

interface MultipleChoiceProps {
  questionData: QuestionData;
  onChange: (questionId: number, option: string, optionId: number) => void;
  borderClass?: string;
}

const MultipleChoice: React.FC<MultipleChoiceProps> = ({ questionData, onChange, borderClass = '' }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleOptionChange = (option: QuestionOption) => {
    setSelectedOption(option.id);
    onChange(option.question_id, option.option, option.id);
  };

  return (
    <div className={`flex flex-col space-y-5 rounded-lg px-5 py-3 border ${borderClass} mt-5`}>
      <label>
        {questionData.question}
        {questionData.is_required && <span style={{ color: 'red' }}>*</span>}
      </label>
      {questionData.QuestionOptions &&
        questionData.QuestionOptions.map((option) => (
          <div key={option.id} className="flex justify-center">
            <div
              onClick={() => handleOptionChange(option)}
              className={`flex items-center gap-2.5 cursor-pointer max-w-600 hover:bg-gray-900 hover:text-white rounded-lg px-5 py-3 border ${
                selectedOption === option.id ? 'bg-gray-900 text-white' : ''
              }`}
            >
              <span>{option.option}</span>
              {selectedOption === option.id && <span>✔️</span>}
            </div>
          </div>
        ))}
    </div>
  );
};

export default MultipleChoice;
