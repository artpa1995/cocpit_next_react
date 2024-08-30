import { NextResponse } from 'next/server';
import Events from '../../../../../models/Events';
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  user: {
    id: number;
  };
}

export async function POST(req:any) {
  const token = req.cookies.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let decodedToken: DecodedToken;
  try {
    decodedToken = jwtDecode<DecodedToken>(token.value);
  } catch (error) {
    console.error('Error decoding token:', error);
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
  }
  const user_id = decodedToken.user.id;

  let requestData;
  try {
    requestData = await req.json();
  } catch (error) {
    console.error('Error parsing request body:', error);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { title, date, type } = requestData;

  try {
    
    if (title) {
      const newevent = await Events.create({
        user_id,
        title,
        date, 
        type
      });
      const response = NextResponse.json({ newevent:newevent });
      return response;
    }

    return NextResponse.json({ error: true, message: 'Answers is required' }, { status: 400 });

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
