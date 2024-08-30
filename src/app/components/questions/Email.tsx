import React from 'react';
interface QuestionOption {
  id: number;
  option: string;
}

interface QuestionData {
  id: number;
  question: string;
  type: number;
  is_required: boolean;
  QuestionOptions?: QuestionOption[];
}
interface EmailProps {
  questionData: QuestionData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  borderClass?: string;
}

const Email: React.FC<EmailProps> = ({ questionData, onChange, borderClass = '' }) => (
  <div className={`flex flex-col space-y-5 rounded-lg px-5 py-3 border ${borderClass} mt-5`}>
    <label>
      {questionData.question}
      {questionData.is_required && <span style={{ color: 'red' }}>*</span>} {/* Звездочка для обязательного вопроса */}
    </label>
    <input
      type="email"
      // name={questionData.id}
      onChange={onChange}
      required={questionData.is_required}
      placeholder="Enter your email"
      className="rounded-lg px-2 py-1 border border-gray-600"
    />
  </div>
);

export default Email;
