import Question from '../../../../../models/Question';
import { NextResponse } from 'next/server';

export async function POST(req: any) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: true }, { status: 400 });
  }
  
  try {
    const qt = await Question.findByPk(id);
    if (qt) {
      await qt.destroy();
      return NextResponse.json({ id: qt.id });
    } else {
      return NextResponse.json({ error: true }, { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting option:', error);
    return NextResponse.json({ error: true }, { status: 500 });
  }
}
  
  