import { useState } from 'react';
import axios from 'axios';

interface AddQuestionProps {
  showModal: boolean;
  onUpdate: () => void;
  onClose: () => void;
}

const AddQuestion: React.FC<AddQuestionProps> = ({ showModal, onClose, onUpdate }) => {
  const [question, setQuestion] = useState('');
  const [questionType, setQuestionType] = useState('1');
  const [isRequired, setIsRequired] = useState(false);
  const [responses, setResponses] = useState(['']);

  const addOption = () => {
    setResponses([...responses, '']);
  };

  const removeOption = (index: number) => {
    const newResponses = responses.filter((_, i) => i !== index);
    setResponses(newResponses);
  };

  const addQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      question: question || '',
      question_type: questionType || '',
      is_required: isRequired ? 1 : 0,
      responses: responses || [],
    };

    try {
      const response = await axios.post('/api/admin/question/addQuestion', formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.data.success) {
        onClose();
        onUpdate();
      }
    } catch (error) {
      console.error('Error adding question', error);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed z-[10010] inset-0 overflow-y-auto">
    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div className="fixed inset-0 transition-opacity">
        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>
      <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
      <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-7xl sm:w-full">
        <div>
          <div className='flex justify-end'>
            <button onClick={onClose} className="text-white px-3 py-2   bg-sky-900 absolute text-lg font-medium ">X</button>
          </div>
         <div className="bg-white px-4  pb-4 sm:p-6 sm:pb-4">
          <h3 className="text-lg text-center leading-6 font-bold text-grey-900">Add Question</h3>
          <form onSubmit={addQuestion}>
            <div className='flex items-center gap-4 mt-5'>
              <label>Question</label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="rounded-lg px-1 py-3 border border-gray-600 w-full"
                placeholder="Question"
              />
            </div>
             <div className='flex items-center gap-4 mt-5'>
              <label>Type</label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                className="rounded-lg px-5 py-3 border border-gray-600"
              >
                <option value="1">Multiple Choice</option>
                <option value="2">Multiple Select</option>
                <option value="3">Multi Select</option>
                <option value="4">Checkbox</option>
                <option value="5">Rank Selected</option>
                <option value="6">Short text</option>
                <option value="7">Long text</option>
                {/* <option value="8">Telephone Number</option>
                <option value="9">Email</option> */}
                <option value="10">Date</option>
              </select>
            </div>
             <div className='flex items-center gap-4 mt-5'>
              <label>Required</label>
              <input
                type="checkbox"
                checked={isRequired}
                onChange={() => setIsRequired(!isRequired)}
              />
            </div>
             <div className='flex items-start gap-4 mt-5'>
              <label>Responses</label>
              <ul>
                {responses.map((response, index) => (
                  <li key={index} className='mb-4 flex gap-4' >
                    <input
                      type="text"
                      value={response}
                      onChange={(e) => {
                        const newResponses = [...responses];
                        newResponses[index] = e.target.value;
                        setResponses(newResponses);
                      }}
                      className="rounded-lg px-5 py-3 border border-gray-600"
                      placeholder="Add Response"
                    />
                    <button type="button" onClick={() => removeOption(index)} className='text-red-500'>×</button>
                  </li>
                ))}
              </ul>
              <button type="button" onClick={addOption} className="text-white bg-sky-900 rounded-lg px-5 py-3">Add</button>
            </div>
            <button type="submit" className="text-white bg-sky-900 rounded-lg px-5 py-3 mt-5">Save</button>
          </form>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default AddQuestion;
