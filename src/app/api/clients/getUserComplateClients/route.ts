import { NextResponse } from 'next/server';
import Bookings from '../../../../models/Bookings';
import Clients from '../../../../models/Clients';
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
  const today = new Date(now.getFullYear(), now.getMonth() , 1);

  try {
    const companies = await Clients.findAll({
      where: { user_id: userId },
      include: [{
        model: Bookings,
        where: {
          date: {
            [Op.lt]: today
          }
        },
        required: true
      }],
      order: [['id', 'ASC']]
    });

    return NextResponse.json(companies);
  } catch (error) {
    console.error('Error fetching Companies:', error);
    return NextResponse.json({ error: 'Error fetching Companies' }, { status: 500 });
  }
}
