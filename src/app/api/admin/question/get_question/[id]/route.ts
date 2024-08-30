import { NextResponse } from 'next/server';
import Question from '../../../../../../models/Question';
import QuestionOption from '../../../../../../models/QuestionOption';

export async function GET(req:any, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const question = await Question.findByPk(id, {
      include: [{ model: QuestionOption }],
    });

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    return new Response(JSON.stringify({ question: question}));

  } catch (error) {
    console.error('Error fetching question:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}



