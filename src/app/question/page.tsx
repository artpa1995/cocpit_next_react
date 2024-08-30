"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import LongText from '../components/questions/LongText';
import ShortText from '../components/questions/ShortText';
import DateInput from '../components/questions/Date';
import MultipleChoice from '../components/questions/MultipleChoice';
import MultipleSelect from '../components/questions/MultipleSelect';
import RankSelect from '../components/questions/RankSelected';
import Header from '../components/user/UserHeader';
import Footer from '../components/user/UserFooter';
import Spinner from '../components/Spinner'; 
import { ClipLoader } from 'react-spinners';

interface QuestionOption {
  id: number;
  option: string;
  question_id: number;
}

interface Question {
  id: number;
  question: string;
  type: number;
  is_required: boolean;
  QuestionOptions?: QuestionOption[];
}

interface Answer {
  answer: string | string[];
  option_id?: number | number[];
}

const Questions = () => {
  const [error, setError] = useState<string>('');
  const [unansweredRequiredQuestions, setUnansweredRequiredQuestions] = useState<number[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [submitProcess, setSubmitProcess] = useState<boolean>(false);

  const router = useRouter();

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

  useEffect(() => {
    getQuestions();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const unanswered = questions.filter(
      (question) => question.is_required && !answers[question.id]
    );

    if (unanswered.length > 0) {
      setError('Please answer all required questions.');
      setUnansweredRequiredQuestions(unanswered.map(q => q.id));
      return;
    }

    setSubmitProcess(true);
    setError('');
    setUnansweredRequiredQuestions([]);
    
    try {
      await axios.post('/api/user/user_answers/add_answer', { answers });
      router.push('/profile');
    } catch (error) {
      console.error('Error submitting answers:', error);
      setError('Error submitting answers');
    } finally {
      setSubmitProcess(false);
    }
  };

  const handleChange = (question_id: number, answer: string | string[], option_id?: number | number[]) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [question_id]: { answer, option_id }
    }));
  };

  const getBorderClass = (questionId: number) => {
    return unansweredRequiredQuestions.includes(questionId)
      ? 'border-red-500'
      : 'border-gray-600';
  };

  return (
    <div className='flex h-full flex-col justify-between'>
      <Header />
      {loading ? (
        <Spinner />
      ) : (
        questions.length > 0 ? (
          <div className='flex justify-center mt-5 mb-9'>
            <form onSubmit={handleSubmit}>
              <h1 className='text-center'>Questions</h1>
              {error && <p className="text-red-500 text-center">{error}</p>}
              <div className='mt-4'>
                {questions.map((question) => {
                  const borderClass = getBorderClass(question.id);
                  switch (question.type) {
                    case 6:
                      return <ShortText key={question.id} questionData={question} onChange={handleChange} borderClass={borderClass} />;
                    case 7:
                      return <LongText key={question.id} questionData={question} onChange={handleChange} borderClass={borderClass} />;
                    case 10:
                      return <DateInput key={question.id} questionData={question} onChange={handleChange} borderClass={borderClass} />;
                    case 1:
                      return <MultipleChoice key={question.id} questionData={question} onChange={handleChange} borderClass={borderClass} />;
                    case 2:
                      return <MultipleSelect key={question.id} questionData={question} onChange={handleChange} borderClass={borderClass} />;
                    case 5:
                      return <RankSelect key={question.id} questionData={question} onChange={handleChange} borderClass={borderClass} />;
                    default:
                      return null;
                  }
                })}
              </div>
              <div className="flex justify-center mt-5">
                {submitProcess ? (
                  <ClipLoader color={'#123abc'} loading={submitProcess} size={35} />
                ) : (
                  <button type="submit" className='text-white bg-sky-900 rounded-lg px-5 py-3'>
                    Submit
                  </button>
                )}
              </div>
            </form>
          </div>
        ) : (
          <div className='text-center'>No questions available.</div>
        )
      )}
      <Footer />
    </div>
  );
};

export default Questions;
