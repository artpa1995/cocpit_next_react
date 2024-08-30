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

interface MultipleSelectProps {
  questionData: QuestionData;
  onChange: (questionId: number, selectedOptions: string[], selectedOptionIds: number[]) => void;
  borderClass?: string;
}

const MultipleSelect: React.FC<MultipleSelectProps> = ({ questionData, onChange, borderClass = '' }) => {
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

  const handleOptionChange = (option: QuestionOption) => {
    const isSelected = selectedOptions.includes(option.id);
    let newSelectedOptions;
    if (isSelected) {
      newSelectedOptions = selectedOptions.filter(id => id !== option.id);
    } else {
      newSelectedOptions = [...selectedOptions, option.id];
    }
    setSelectedOptions(newSelectedOptions);
    if (questionData.QuestionOptions) {
      onChange(
        questionData.id,
        newSelectedOptions.map(id => questionData.QuestionOptions?.find(o => o.id === id)?.option || ''),
        newSelectedOptions
      );
    }
  };

  return (
    <div className={`flex flex-col space-y-5 rounded-lg px-5 py-3 border ${borderClass} mt-5`}>
      <label>
        {questionData.question}
        {questionData.is_required && <span style={{ color: 'red' }}>*</span>}
      </label>
      {questionData.QuestionOptions?.map((option) => (
        <div key={option.id} className="flex justify-center">
          <div
            onClick={() => handleOptionChange(option)}
            className={`flex items-center gap-2.5 cursor-pointer max-w-600 hover:bg-gray-900 hover:text-white rounded-lg px-5 py-3 border ${
              selectedOptions.includes(option.id) ? 'bg-gray-900 text-white' : ''
            }`}
          >
            <span>{option.option}</span>
            {selectedOptions.includes(option.id) && <span>✔️</span>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MultipleSelect;
