

import { jwtDecode } from "jwt-decode";
import User from '../../../../models/User';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

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

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return NextResponse.json({ message: 'Пользователь не найден' }, { status: 404 });
    }

    const formData = await req.formData();
    const avatarFile = formData.get('file') as File;

    if (avatarFile) {
      const uploadDir = path.join(process.cwd(), 'public/images/user');
      const filePath = path.join(uploadDir, `${id}_avatar_${Date.now()}.png`);

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const buffer = Buffer.from(await avatarFile.arrayBuffer());

      fs.writeFileSync(filePath, buffer);

      user.avatar = `/images/user/${path.basename(filePath)}`;
      await user.save();
    }
    if (!SECRET_KEY) {
      throw new Error('TOKEN_SECRET_KEY is not defined in the environment variables.');
    }

    const token_new = jwt.sign({ user: user }, SECRET_KEY, { expiresIn: '24h' })

    const response = NextResponse.json({ message:user });
    response.cookies.set('token', token_new, );

    return response;
    
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update avatar' }, { status: 500 });
  }
}
