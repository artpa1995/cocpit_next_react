import { NextResponse } from 'next/server';
// import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../../../models/User';
import { compileWelcomeTemplate, sendMail } from "@/lib/mail";


// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'cockpit_new',
//     password: 'root',
//     port: 5432,
//   });

export async function POST(req: Request) {
  const { first_name, last_name, email, password, phone } = await req.json();
  const hashedPassword = await bcrypt.hash(password, 10);
  const SECRET_KEY = process.env.TOKEN_CECRET_KEY; 
  try {

    const isset_user = await User.findOne({ where: { email } });

    if(isset_user){
      return NextResponse.json({ error: 'A user with this email already exists' });
    }

    const user = await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role: 1, 
      phone
    });

    if(user){
      try {
        await sendMail({
          to: email,
          name: first_name,
          subject: "Registration",
          body: compileWelcomeTemplate(first_name, "youtube.com"),
        });
      } catch (error) {
        console.log(error);
      }
    }

    if (!SECRET_KEY) {
      throw new Error('TOKEN_SECRET_KEY is not defined in the environment variables.');
    }
    const token = jwt.sign({ user: user }, SECRET_KEY, { expiresIn: '24h' })

    const response = NextResponse.json({ message:user });
    response.cookies.set('token', token, );

    return response;

  } catch (error) {
    console.error('Error inserting user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}



    // const result = await pool.query(
    //   'INSERT INTO users (first_name, last_name, email, role, password) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    //   [first_name,last_name, email, 1, hashedPassword]
    // );
    // return NextResponse.json(result.rows[0], { status: 201 });