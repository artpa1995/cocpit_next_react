import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "jwt-decode";

interface UserPayload extends JwtPayload {
  user: {
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    avatar?: string;
    role?:number
  };
}

export function userMiddleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const decoded =  jwtDecode<UserPayload>(token);
    if (decoded.user.role !== 1) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
    (req as any).user = decoded;
    return NextResponse.next();
  } catch (error) {
    console.error('Invalid token:', error);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}






                                          