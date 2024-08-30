
import Question from '../../../.././../models/Question';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function PUT(request: NextRequest, {  }) {
  
  const {questions} = await request.json();

  try {
  
      const updatePromises = questions.map(async (question:any) => {
        return await Question.update(
          { queue: question.queue }, 
          { where: { id: question.id } } 
        );
      });
  
      await Promise.all(updatePromises); 
  
      return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error updating questions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
