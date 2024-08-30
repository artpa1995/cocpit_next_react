import { NextRequest, NextResponse } from 'next/server';
import { adminMiddleware } from './middleware/adminMiddleware';
import { userMiddleware } from './middleware/userMiddleware';
import { coachMiddleware } from './middleware/coachMiddleware';
import { authMiddleware } from './middleware/authMiddleware';

const adminRoutes = ['/dashboard'];
const authRoutes = ['/profile'];
const coachRoutes = ['/dashboard'];
const userRoutes = ['/login', '/signup', '/', '/profile'];

export function middleware(req: NextRequest) {
  
  const url = req.nextUrl.pathname

  if (url === '/login' || url === '/register' || url.startsWith('/company')) {
    return authMiddleware(req); 
  }    

  if (req.nextUrl.pathname.startsWith('/profile') 
      || req.nextUrl.pathname.startsWith('/question')
      || req.nextUrl.pathname.startsWith('/events') 
      || req.nextUrl.pathname.startsWith('/bookings') ) {
    return authMiddleware(req);
  }
  if (url.startsWith('/admin')) {
    return adminMiddleware(req);
  } else if (url.startsWith('/user')) {
    return userMiddleware(req);
  } else if (url.startsWith('/coach')) {
    return coachMiddleware(req);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile', '/events', '/bookings', '/question', '/login', '/register', '/admin/:path*', '/user/:path*', '/coach/:path*', '/company/:path*'],
};

