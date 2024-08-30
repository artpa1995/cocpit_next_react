import { NextResponse } from 'next/server';
import Bookings from '../../../../models/Bookings';
import { jwtDecode } from 'jwt-decode';
import { Op } from 'sequelize';

interface DecodedToken {
  user: {
    id: number;
  };
}

export async function POST(req: any) {
  const token = req.cookies.get('token');

  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  let decodedToken: DecodedToken;
  try {
    decodedToken = jwtDecode<DecodedToken>(token.value);
  } catch (error) {
    console.error('Error decoding token:', error);
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
  }

  const userId = decodedToken.user?.id;
  if (!userId) {
    return NextResponse.json({ error: 'User ID not found in token' }, { status: 401 });
  }

  const now = new Date();
  const lastDayPreviousMonth = new Date(now.getFullYear(), now.getMonth() , 1);

  try {
    const bookings = await Bookings.sum('ltv', {
        where: { 
          user_id: userId, 
          date: {
            [Op.gt]: lastDayPreviousMonth
          } 
        }
      });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Error fetching bookings' }, { status: 500 });
  }
}
