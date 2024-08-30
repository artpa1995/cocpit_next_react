import QuestionOption from '../../../../../models/QuestionOption';
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

export async function PUT(req:any) {
    const { id, value } = await req.json();
  
    if (!id) {
      return NextResponse.json({ error: true }, { status: 400 });
    }
  
    try {
      const option = await QuestionOption.findByPk(id);
      if (option) {
        option.option = value;
        await option.save();
        return NextResponse.json({ id: option.id });
      } else {
        return NextResponse.json({ error: true }, { status: 404 });
      }
    } catch (error) {
      console.error('Error editing option:', error);
      return NextResponse.json({ error: true }, { status: 500 });
    }
  }

  export async function DELETE(req:any) {
    const { id } = await req.json();
  
    if (!id) {
      return NextResponse.json({ error: true }, { status: 400 });
    }
  
    try {
      const option = await QuestionOption.findByPk(id);
      if (option) {
        await option.destroy();
        return NextResponse.json({ id: option.id });
      } else {
        return NextResponse.json({ error: true }, { status: 404 });
      }
    } catch (error) {
      console.error('Error deleting option:', error);
      return NextResponse.json({ error: true }, { status: 500 });
    }
  }
  
  