
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { jwtDecode } from "jwt-decode";
import jwt from 'jsonwebtoken';
import User from '../../../../models/User';


interface DecodedToken {
  user: {
    id: number;
  };
} 

export async function POST(req: any) {
  const token = req.cookies.get('token');
  const SECRET_KEY = process.env.TOKEN_CECRET_KEY!;

  const { time_zone, start_date, end_date, week_days, currency} = await req.json();

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
  const id = decodedToken.user.id;

  const user = await User.findByPk(id); 
  if (!user) {
    return NextResponse.json({ message: 'Пользователь не найден' }, { status: 404 });
  }

    user.time_zone = time_zone;
    user.start_date = start_date;
    user.end_date = end_date;
    user.week_days = week_days;
    user.currency = currency;
    

  
  await user.save();

  const token_new = jwt.sign({ user: user }, SECRET_KEY, { expiresIn: '24h' })

  const response = NextResponse.json({ message:user });
  response.cookies.set('token', token_new, );

  return response;

}
