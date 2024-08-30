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

export function coachMiddleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;  
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  const decoded =  jwtDecode<UserPayload>(token);

  let roles = [2,3];

  try {    
    if ((decoded.user.role && !roles.includes(decoded.user.role))  || !decoded.user.role ) {
      return NextResponse.redirect(new URL('/profile', req.url));
    }
    (req as any).user = decoded;
    return NextResponse.next();
  } catch (error) {
    console.error('Invalid token:', error);
  }
}
