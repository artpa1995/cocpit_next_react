"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import AddQuestion from '../../components/admin/modals/AddQuestion';
import EditQuestion from '../../components/admin/modals/EditQuestion';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import Spinner from '../../components/Spinner'; 
import AdminLayout from '../AdminLayout';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

interface QuestionTypes {
  id: number;
  question: string;
  queue: number;
}

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
  queue: number;
}

const Questions = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<QuestionData | null>(null);

  const getQuestions = async () => {
    try {
      const response = await axios.get('/api/admin/question/get_question');
      setQuestions(response.data.questions || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteQuestion = async (id: string) => {
    try {
      await axios.post(`/api/admin/question/delete_question`, { id });
      getQuestions();
    } catch (error) {
      console.error('Error removing question:', error);
    }
  };

  const getQuestion = async (id: string) => {
    try {
      const response = await axios.get(`/api/admin/question/get_question/${id}`);
      setSelectedQuestion(response.data.question);
      setShowEditModal(true);
    } catch (error) {
      console.error('Error fetching question:', error);
    }
  };

  const handleDeleteClick = (question: QuestionData) => {
    setQuestionToDelete(question);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (questionToDelete) {
      await deleteQuestion(questionToDelete.id);
      setQuestionToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (draggedIndex === index) return;

    const reorderedQuestions = [...questions];
    const [removed] = reorderedQuestions.splice(draggedIndex, 1);
    reorderedQuestions.splice(index, 0, removed);

    const newQueueOrder = reorderedQuestions.map((question, idx) => ({
      ...question,
      queue: idx + 1
    }));

    setQuestions(newQueueOrder);
    updateQuestionQueue(newQueueOrder);
  };

  const updateQuestionQueue = async (newQueueOrder: QuestionData[]) => {
    const newOrder = newQueueOrder.map(question => ({
      id: question.id,
      queue: question.queue
    }));

    try {
      await axios.put('/api/admin/question/update_questions_queue', { questions: newOrder });
    } catch (error) {
      console.error('Error updating question queue:', error);
    }
  };

  useEffect(() => {
    getQuestions();
  }, []);

  return (
    <AdminLayout>
      <div className='container p-4'>
        <h1 className='text-center mt-6 font-bold'>Questions</h1>
        <div className="flex justify-end">
          <button className="text-white bg-sky-900 rounded-lg px-5 py-3" onClick={() => setShowAddModal(true)}>
            Add Question
          </button>
        </div>
      
        <AddQuestion 
          showModal={showAddModal}
          onClose={() => setShowAddModal(false)} 
          onUpdate={getQuestions}
        />
        <div className='flex justify-center mt-5 mb-5'>
          {loading ? (
            <Spinner /> 
          ) : (
            questions.length > 0 ? (
              <div>
                {questions.map((question, index) => (
                  <div
                    key={question.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragOver={(e) => e.preventDefault()}
                    className='flex items-center gap-x-3 mt-4'
                  >
                    <div className='cursor-pointer'>
                      <DragIndicatorIcon />
                    </div>
                    <div className='flex justify-between w-full'>
                      <button onClick={() => getQuestion(question.id)} className='cursor-pointer'>
                        {question.queue + ')'} {question.question}
                      </button>
                      <button onClick={() => handleDeleteClick(question)} className='text-white bg-red-900 rounded-lg px-5 py-3'>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>No questions available.</div>
            )
          )}
        </div>
        {selectedQuestion && (
          <EditQuestion
            showModal={showEditModal}
            onClose={() => setShowEditModal(false)}
            question={selectedQuestion}
            onUpdate={getQuestions}
          />
        )}

        <DeleteConfirmationModal 
          showModal={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          title={questionToDelete ? 'Are you sure you want to delete the question: ' + questionToDelete.question + ' ?' : ''}
        />
      </div>
    </AdminLayout>
  );
};

export default Questions;

