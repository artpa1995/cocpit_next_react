import { NextResponse } from 'next/server';
import Bookings from '../../../../models/Bookings';
import Clients from '../../../../models/Clients';
import {jwtDecode} from "jwt-decode";

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
    const Companies = await Clients.findAll({
      where: { user_id: userId },
      include: [{
        model: Bookings,
      }],
      order: [['id', 'ASC']]
    });

    return NextResponse.json(Companies);
  }catch (error) {
    console.error('Error fetching Companies:', error);
    return NextResponse.json({ error: 'Error fetching Companies' }, { status: 500 });
  }
};

