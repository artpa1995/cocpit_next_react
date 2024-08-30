

import { NextResponse } from 'next/server';
import Question from '../../../../../models/Question';
import QuestionOption from '../../../../../models/QuestionOption'

export async function GET() {
  try {
    const questions = await Question.findAll({ include: [{ model: QuestionOption, as: 'options' }], order: [['queue', 'ASC']] }); 
    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}



