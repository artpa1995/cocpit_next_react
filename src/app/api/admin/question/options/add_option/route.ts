import QuestionOption from '../../../../../../models/QuestionOption';
import { NextResponse } from 'next/server';

export async function POST(req:any) {
  const { id } = await req.json();
  
  if (!id) {
    return NextResponse.json({ error: true }, { status: 400 });
  }

  try {
    const newOption = await QuestionOption.create({ question_id: id });
    return NextResponse.json({ id: newOption.id });
  } catch (error) {
    console.error('Error adding option:', error);
    return NextResponse.json({ error: true }, { status: 500 });
  }
}
    