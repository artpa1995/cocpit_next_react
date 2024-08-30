import { NextResponse } from 'next/server';
import EventType from '../../../../../models/EventType';
export async function POST(req:any) {

  let requestData;
  try {
    requestData = await req.json();
  } catch (error) {
    console.error('Error parsing request body:', error);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { type } = requestData;
  try {
    
    if (type) {
      const newEventTpe = await EventType.create({
        type
      });
      const response = NextResponse.json({ message:true });
      return response;
    }

    return NextResponse.json({ error: true, message: 'Type is required' }, { status: 400 });

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
