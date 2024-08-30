import { NextRequest } from 'next/server';
import Question from '../../../../../../models/Question';
import { NextResponse } from 'next/server';

interface Params {
  params: {
    id: string;
  };
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = params;
  const body = await request.json();

  try {
    const question = await Question.findByPk(id);
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    await question.update(body);
    return NextResponse.json({ success: true, question });
  } catch (error) {
    console.error('Error updating question:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
