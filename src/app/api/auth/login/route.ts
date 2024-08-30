import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../../../models/User';

const SECRET_KEY = process.env.TOKEN_CECRET_KEY;

export async function POST(request: Request) {
  try {
    const { email, password, gmailLogin } = await request.json();
    const user = await User.findOne({ where: { email } });
   
    if (!user) {
      return NextResponse.json({ message: 'Invalid user' }, { status: 401 });
    }

    let isPasswordValid = true;
    
    if(!gmailLogin){
      isPasswordValid = await bcrypt.compare(password, user.password);
    }

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
    }
    if (!SECRET_KEY) {
      throw new Error('TOKEN_SECRET_KEY is not defined in the environment variables.');
    }
    const token = jwt.sign({ user: user }, SECRET_KEY, { expiresIn: '24h' })
    const response = NextResponse.json({ message:user });
    response.cookies.set('token', token, );

    return response;

  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ error: 'Internal Server Error e' }, { status: 500 });
  }
}
