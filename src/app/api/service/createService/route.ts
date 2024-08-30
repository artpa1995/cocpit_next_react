import { NextResponse } from 'next/server';
import Service from '../../../../models/Service';
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

  if (!user_id) {
    return NextResponse.json({ error: 'User Not found' }, { status: 401 });
  }

  try {
    const { type, price, currency } = await req.json();
    const newService = await Service.create({ 
      type,
      price,
      currency,
      user_id,
    });

    return NextResponse.json({ success: true, service: newService });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
