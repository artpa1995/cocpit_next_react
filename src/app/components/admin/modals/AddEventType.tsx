import { useState } from 'react';
import axios from 'axios';

interface addEventTypeProps {
  showModal: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const addEventType: React.FC<addEventTypeProps> = ({ showModal, onClose, onUpdate }) => {

  const [type, setType] = useState('');
  const addEventType = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/admin/events/addEventType', { type: type}, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.data.message) {
        onClose();
        onUpdate();
        setType('')
      }
    } catch (error) {
      console.error('Error adding question', error);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed z-[10010] inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:align-middle sm:max-w-lg sm:w-full">
          <div className="flex justify-end ">
            <button onClick={onClose} className="text-white px-3 py-2 bg-sky-900 text-lg font-medium rounded">X</button>
          </div>
          <div className="bg-white px-6 pb-4 sm:p-6 sm:pb-4">
            <h3 className="text-lg text-center leading-6 font-bold text-gray-900 mb-4">Add Event Type</h3>
            <form onSubmit={addEventType}>
              <div className="flex items-center gap-2 mb-4">
                <label className=" text-right">Type</label>
                <input
                  onChange={(e) => setType(e.target.value)}
                  className="flex-1 rounded-lg px-4 py-2 border border-gray-300"
                />
              </div>
              <div className="text-center">
                <button type="submit" className="text-white bg-sky-900 rounded-lg px-5 py-2">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default addEventType;
