import { NextResponse } from 'next/server';
import  Bookinkgs from '../../../models/Bookings';
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    user: {
      id: number;
    };
}

export async function POST(req: any) {
    const { month, client_id, ltv } = await req.json();
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

    if(!user_id){
        return NextResponse.json({ error: 'User Not found' }, { status: 401 });
    }

    const date = month.replace(/\//g, '-')+ ' 00:00:01+00';
    
    try {       
        const newBookings = await Bookinkgs.create({ 
            user_id: user_id,
            client_id: client_id,
            status: 1,
            ltv,
            date:date
        })
        return NextResponse.json({ newBookings, month });
    } catch (error) {
      console.error('Error updating currency:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
  