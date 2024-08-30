import { NextResponse } from 'next/server';
import Bookings from '../../../../models/Bookings';
import { jwtDecode } from 'jwt-decode';
import { Op, Sequelize } from 'sequelize';

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
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear(), 11, 31);
    const bookingsCountByDate = await Bookings.findAll({
      where: { 
        user_id: userId, 
        date: {
          [Op.between]: [startOfYear, endOfYear]
        } 
      },
      attributes: [
        [Sequelize.fn('TO_CHAR', Sequelize.col('date'), 'MM/YYYY'), 'date'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      group: [Sequelize.fn('TO_CHAR', Sequelize.col('date'), 'MM/YYYY')],
      order: [[Sequelize.fn('TO_CHAR', Sequelize.col('date'), 'MM/YYYY'), 'ASC']]
    });

    const result = bookingsCountByDate.map((booking: any) => ({
      date: booking.getDataValue('date'),
      count: booking.getDataValue('count'),
    }));

    const allMonths = Array.from({ length: 12 }, (_, i) => {
      const month = (i + 1).toString().padStart(2, '0');
      return { date: `${month}/${now.getFullYear()}`, count: "0" };
    });
    
    const completeResult = allMonths.map(month => {
      const found = result.find(item => item.date === month.date);
      return found ? found : month;
    });

    return NextResponse.json(completeResult);
  } catch (error) {
    console.error('Error fetching bookings count by date:', error);
    return NextResponse.json({ error: 'Error fetching test' }, { status: 500 });
  }
}
