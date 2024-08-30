
import UserAnswer from '../../../../../models/UserAnswer';
import User from '../../../../../models/User';
import { NextResponse } from 'next/server';
import { jwtDecode } from "jwt-decode";
import jwt from 'jsonwebtoken';

interface DecodedToken {
  user: {
    id: number;
  };
} 

export async function POST(req:any) {

  const token = req.cookies.get('token');
  const SECRET_KEY = process.env.TOKEN_CECRET_KEY;

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

  let requestData;
  try {
    requestData = await req.json();
  } catch (error) {
    console.error('Error parsing request body:', error);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { answers} = requestData;

  try {
    
    if (answers) {
      const user = await User.findByPk(user_id); 
      if(!user){
        return NextResponse.json({ error: 'User Not Found' });
      }
   
      const newUserAnswer = await UserAnswer.create({
        user_id,
        answers: JSON.stringify(answers)
      });

      user.status = 2;
      await user.save();

      if (!SECRET_KEY) {
        throw new Error('TOKEN_SECRET_KEY is not defined in the environment variables.');
      }

      const token_new = jwt.sign({ user: user }, SECRET_KEY, { expiresIn: '24h' })
      const response = NextResponse.json({ message:user });
      response.cookies.set('token', token_new, );
    
      return response;
    }

    return NextResponse.json({ error: true, message: 'Answers is required' }, { status: 400 });

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
