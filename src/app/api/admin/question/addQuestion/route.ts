import Question from '../../../../../models/Question';
import QuestionOption from '../../../../../models/QuestionOption';
import { NextResponse } from 'next/server';

export async function POST(req:any) {
  let requestData;
  try {
    requestData = await req.json();
  } catch (error) {
    console.error('Error parsing request body:', error);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { question, question_type, is_required, responses } = requestData;

  try {
    const lastQuestion = await Question.findOne({
      order: [['queue', 'DESC']],
    });
    const queue = lastQuestion && lastQuestion.queue ? lastQuestion.queue + 1 : 1;

    if (question) {
      
      const newQuestion = await Question.create({
        queue,
        is_required,
        question,
        type: question_type,
      });

      if (responses && responses.length > 0) {
        const questionOptions = responses.map((response:any) => ({
          question_id: newQuestion.id,
          option: response,
        }));
        await QuestionOption.bulkCreate(questionOptions);
      }

      return NextResponse.json({ success: true, message: newQuestion });
    }

    return NextResponse.json({ error: true, message: 'Question is required' }, { status: 400 });

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
