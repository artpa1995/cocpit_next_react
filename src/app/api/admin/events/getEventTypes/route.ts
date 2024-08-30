
import { NextResponse } from 'next/server';
import EventType from '../../../../../models/EventType'

export async function GET() {
  try {
    const types = await EventType.findAll(); 
    return NextResponse.json({ types });
  } catch (error) {
    console.error('Error fetching types:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}