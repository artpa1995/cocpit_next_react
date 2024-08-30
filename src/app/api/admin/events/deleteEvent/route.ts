import { NextResponse } from 'next/server';
import  Events  from '../../../../../models/Events';

export async function POST(req: any) {
    const { id } = await req.json();
  
    if (!id) {
      return NextResponse.json({ error: true }, { status: 400 });
    }
    
    try {
      const ev = await Events.findByPk(id);
      if (ev) {
        await ev.destroy();
        return NextResponse.json({ id: ev.id });
      } else {
        return NextResponse.json({ error: true }, { status: 404 });
      }
    } catch (error) {
      console.error('Error deleting option:', error);
      return NextResponse.json({ error: true }, { status: 500 });
    }
  }