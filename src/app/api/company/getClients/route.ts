import { NextResponse } from 'next/server';
import { Op } from 'sequelize';
import CompanyUserRelation from '../../../../models/CompanyUserRelation';
import {jwtDecode} from 'jwt-decode';
import { startOfYear, endOfToday, getMonth } from 'date-fns';

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
    const startOfYearDate = startOfYear(new Date());
    const endOfTodayDate = endOfToday();

    const clients = await CompanyUserRelation.findAll({
      where: {
        coach_id: userId,
        createdAt: {
          [Op.between]: [startOfYearDate, endOfTodayDate]
        }
      },
      attributes: ['coach_id', 'createdAt'],
      raw: true
    });    

    const monthlyCounts = Array(12).fill(0);

    clients.forEach(client => {
      const month = getMonth(new Date(client.createdAt));
      monthlyCounts[month]++;
    });

    return NextResponse.json(monthlyCounts);
  } catch (error) {
    console.error('Error fetching Companies:', error);
    return NextResponse.json({ error: 'Error fetching Companies' }, { status: 500 });
  }
}
