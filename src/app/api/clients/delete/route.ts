import { NextResponse } from 'next/server';
import  Clients  from '../../../../models/Clients';

export async function POST(req: any) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: true }, { status: 400 });
  }
  
  try {
    const ser = await Clients.findByPk(id);
    if (ser) {
      await ser.destroy();
      return NextResponse.json({ id: ser.id });
    } else {
      return NextResponse.json({ error: true }, { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting option:', error);
    return NextResponse.json({ error: true }, { status: 500 });
  }
}
  