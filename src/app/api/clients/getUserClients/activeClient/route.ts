import Clients from '../../../../../models/Clients';
import { NextResponse } from 'next/server';
import { jwtDecode } from "jwt-decode";
import Bookings from '../../../../../models/Bookings';
import { Op } from 'sequelize';

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

    try {

      const now = new Date();
      const lastDayPreviousMonth = new Date(now.getFullYear(), now.getMonth() , 1);

      const clientsCount = await Clients.count({
        where: {
          user_id: user_id,
          '$Bookings.date$': {
            [Op.gt]: lastDayPreviousMonth
          }
        },
        include: [{
          model: Bookings,
          attributes: []
        }],
        distinct: true,
      });   

      return new Response(JSON.stringify({ clientsCount }), { status: 200 });
    } catch (error) {
        console.error('Error fetching Clients:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
