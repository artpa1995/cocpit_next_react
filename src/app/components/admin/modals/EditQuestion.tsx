import { useEffect, useState } from 'react';
import axios from 'axios';

interface QuestionOption {
  id: string;
  option: string;
}

interface QuestionData {
  id: string;
  question: string;
  type: string;
  is_required: boolean;
  QuestionOptions: QuestionOption[];
}

interface EditQuestionProps {
  showModal: boolean;
  question?: QuestionData;
  onClose: () => void;
  onUpdate: () => void;
}

const EditQuestion: React.FC<EditQuestionProps> = ({ showModal, question, onClose, onUpdate }) => {
  const [questionData, setQuestionData] = useState<QuestionData>({
    id: '',
    question: '',
    type: '',
    is_required: false,
    QuestionOptions: []
  });

  useEffect(() => {
    if (question) {
      setQuestionData(question);
    }
  }, [question]);

  const editOption = async (optionId: string, value: string) => {
    try {
      await axios.post(`/api/admin/question/options/edit_option`, { id: optionId, value });
    } catch (error) {
      console.error('Error editing option:', error);
    }
  };

  const addOption = async () => {
    try {
      const response = await axios.post(`/api/admin/question/options/add_option`, { id: questionData.id });
      setQuestionData(prevState => ({
        ...prevState,
        QuestionOptions: [...prevState.QuestionOptions, { option: '', id: response.data.id }],
      }));
    } catch (error) {
      console.error('Error adding option:', error);
    }
  };

  const removeOption = async (index: number, optionId: string) => {
    try {
      await axios.post(`/api/admin/question/options/delete_option`, { id: optionId });
      setQuestionData(prevState => {
        const updatedOptions = [...prevState.QuestionOptions];
        updatedOptions.splice(index, 1);
        return { ...prevState, QuestionOptions: updatedOptions };
      });
    } catch (error) {
      console.error('Error removing option:', error);
    }
  };

  const updateQuestion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/admin/question/update_question/${questionData.id}`, questionData);
      if (response.data.success) {
        onUpdate();
        onClose();
      }
    } catch (error) {
      console.error('Error updating question:', error);
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
              <button onClick={onClose} className="text-white px-3 py-2 bg-sky-900 absolute text-lg font-medium">X</button>
            </div>
            <div className="bg-white px-4 pb-4 sm:p-6 sm:pb-4">
              <h3 className="text-lg text-center leading-6 font-bold text-grey-900">Edit Question</h3>
              <form onSubmit={updateQuestion}>
                <div className='flex items-center gap-4 mt-5'>
                  <label>Question</label>
                  <textarea
                    value={questionData.question}
                    onChange={e => setQuestionData({ ...questionData, question: e.target.value })}
                    className="rounded-lg px-1 py-3 border border-gray-600 w-full"
                    placeholder="Question"
                  />
                </div>
                <div className='flex items-center gap-4 mt-5'>
                  <label>Type</label>
                  <select
                    value={questionData.type}
                    onChange={e => setQuestionData({ ...questionData, type: e.target.value })}
                    className="rounded-lg px-5 py-3 border border-gray-600"
                  >
                    <option value="1">Multiple Choice</option>
                    <option value="2">Multiple Select</option>
                    <option value="3">Multi Select</option>
                    <option value="4">Checkbox</option>
                    <option value="5">Rank Selected</option>
                    <option value="6">Short text</option>
                    <option value="7">Long text</option>
                    <option value="10">Date</option>
                  </select>
                </div>
                <div className='flex items-center gap-4 mt-5'>
                  <label>Required</label>
                  <input
                    type="checkbox"
                    checked={questionData.is_required}
                    onChange={e => setQuestionData({ ...questionData, is_required: e.target.checked })}
                  />
                </div>
                <div className='flex items-start gap-4 mt-5'>
                  <label>Responses</label>
                  <ul>
                    {questionData.QuestionOptions.map((response, index) => (
                      <li key={response.id} className='mb-4 flex gap-4'>
                        <input
                          type="text"
                          value={response.option}
                          onChange={e => {
                            const updatedOptions = [...questionData.QuestionOptions];
                            updatedOptions[index].option = e.target.value;
                            setQuestionData({ ...questionData, QuestionOptions: updatedOptions });
                            editOption(response.id, e.target.value);
                          }}
                          className="rounded-lg px-5 py-3 border border-gray-600"
                          placeholder="Add Response"
                        />
                        <button type="button" onClick={() => removeOption(index, response.id)} className='text-red-600'>Remove</button>
                      </li>
                    ))}
                  </ul>
                  <button type="button" onClick={addOption} className='text-green-600'>Add Option</button>
                </div>
                <button type="submit" className='text-white bg-sky-900 rounded-lg px-5 py-3'>Save</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditQuestion;
