import React, { useState } from 'react';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

interface Option {
  id: number;
  option: string;
}

interface QuestionData {
  id: number;
  question: string;
  type: number;
  is_required: boolean;
  QuestionOptions?: Option[];
}

interface RankSelectProps {
  questionData: QuestionData;
  onChange: (questionId: number, selectedOptions: string[], selectedOptionIds: number[]) => void;
  borderClass: string;
}

const RankSelect = ({ questionData, onChange, borderClass }: RankSelectProps) => {
  const [items, setItems] = useState<Option[]>(questionData.QuestionOptions || []);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (draggedIndex === index) return;

    const newItems = [...items];
    const [removed] = newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, removed);

    setItems(newItems);
    onChange(
      questionData.id, 
      newItems.map(item => item.option),
      newItems.map(item => item.id)
    );
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className={`flex flex-col space-y-5 rounded-lg px-5 py-3 border ${borderClass} mt-5`}>
      <label>
        {questionData.question}
        {questionData.is_required && <span style={{ color: 'red' }}>*</span>}
      </label>
      <div className='rounded-lg px-5 py-3 border border-grey-600 mt-5'>
        {items.map((item, index) => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className='flex items-center cursor-pointer hover:bg-gray-900 hover:text-white rounded-lg px-2 py-1 mb-2'
          >
            <DragIndicatorIcon />
            {item.option}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RankSelect;
