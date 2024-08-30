// src/middleware/authMiddleware.ts
import { NextResponse } from 'next/server';
import { jwtDecode } from "jwt-decode"
import ResolvingViewport from 'next/dist/lib/metadata/types/metadata-interface.js';
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

export async function authMiddleware(req: any) {
  const token = req.cookies.get('token');
  const url = req.nextUrl.pathname;

  if ((url === '/login' || url === '/register') && token) {
    return NextResponse.redirect(new URL('/profile', req.url));
  }


  if (!token && url != '/login' &&  url != '/register') {
   return NextResponse.redirect(new URL('/login', req.url));
  }
  
  if(token && token.value){
    const decodedToken =  jwtDecode<UserPayload>(token.value);
    
    const role = decodedToken.user.role

    if (role == 1 && url.startsWith('/company') ) {
      return NextResponse.redirect(new URL('/profile', req.url));
    }
  }

  
  return NextResponse.next();
}
