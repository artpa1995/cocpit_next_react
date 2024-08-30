
import { NextResponse } from 'next/server';
// import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import { jwtDecode } from "jwt-decode";
import jwt from 'jsonwebtoken';
import User from '../../../../models/User';

// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'cockpit_new',
//   password: 'root',
//   port: 5432,
// });

interface DecodedToken {
  user: {
    id: number;
  };
} 

export async function POST(req: any) {
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
  const id = decodedToken.user.id;

  const user = await User.findByPk(id); 
  if (!user) {
    return NextResponse.json({ message: 'Пользователь не найден' }, { status: 404 });
  }

  const formData = await req.formData();

  if (formData.get('first_name')) user.first_name = formData.get('first_name');
  if (formData.get('last_name')) user.last_name = formData.get('last_name');
  if (formData.get('last_name')) user.phone = formData.get('phone');
  // if (email) user.email = email;
  if (formData.get('password')){
    const hashedPassword = await bcrypt.hash(formData.get('password'), 10);
    user.password = hashedPassword
  } 
  
  await user.save();

  if (!SECRET_KEY) {
    throw new Error('TOKEN_SECRET_KEY is not defined in the environment variables.');
  }
  const token_new = jwt.sign({ user: user }, SECRET_KEY, { expiresIn: '24h' })

  const response = NextResponse.json({ message:user });
  response.cookies.set('token', token_new, );

  return response;
  

  // const firstName = formData.get('first_name');
  // const lastName = formData.get('last_name');
  // const password = formData.get('password');
  // const avatar = formData.get('avatar');


  // if (first_name) user.first_name = first_name;
    // if (last_name) user.last_name = last_name;
    // if (email) user.email = email;
    // if (password) user.password = password; // Не забудьте хэшировать пароль
    // if (role) user.role = role;
    // if (status) user.status = status;
    // if (avatar) user.avatar = avatar;

  // try {
    // const updates = [
    //   `first_name = COALESCE($1, first_name)`,
    //   `last_name = COALESCE($2, last_name)`,
    // ];
    // const values = [firstName, lastName];

    // if (password) {
    //   const hashedPassword = await bcrypt.hash(password, 10);
    //   updates.push(`password = $3`);
    //   values.push(hashedPassword);
    // }

    // if (avatar) {
    //   updates.push(`avatar = $4`);
    //   values.push(avatar);
    // }

    // const query = `UPDATE users SET ${updates.join(', ')} WHERE id = $5 RETURNING *`;
    // values.push(userId);
    
    // const result = await pool.query(query, values);
    // return NextResponse.json(result.rows[0], { status: 200 });
  // } catch (error) {
  //   console.error('Error updating user:', error);
  //   return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  // }
}
