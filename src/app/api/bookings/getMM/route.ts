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

  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const prevStartOfMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevEndOfMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const prev_month = await Bookings.sum('ltv', {
        where: { 
          user_id: userId, 
          date: {
            [Op.between]: [prevStartOfMonth, prevEndOfMonth]
          } 
        }
      });
    const this_month = await Bookings.sum('ltv', {
        where: { 
          user_id: userId, 
          date: {
            [Op.between]: [startOfMonth, endOfMonth]
          } 
        }
      });

    let percentChange = 0;

    if (prev_month > 0) {
        percentChange = ((this_month - prev_month) / prev_month) * 100;
        percentChange = parseFloat(percentChange.toFixed(2)); 
    }

    return NextResponse.json({percentChange});
  } catch (error) {
    console.error('Error fetching test:', error);
    return NextResponse.json({ error: 'Error fetching test' }, { status: 500 });
  }
}