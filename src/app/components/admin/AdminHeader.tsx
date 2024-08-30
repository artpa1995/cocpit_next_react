"use client";

import Cookies from 'js-cookie';
import { signOut } from "next-auth/react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { JwtPayload } from "jwt-decode";
import { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";

interface UserPayload extends JwtPayload {
  user: {
    role: number;
  };
}

const CoachHeader: React.FC = () => {
  const token = Cookies.get('token');
  const [role, setRole] = useState<number | null>(null);
  const [adminUrl, setaAminUrl] = useState<number | null>(null);
  const pathname = usePathname();
  const currentPath = pathname;


  useEffect(() => {

    if (token) {
      const decodedToken = jwtDecode<UserPayload>(token);
      setRole(decodedToken.user.role || 1);
    }
     if( pathname.includes('admin')){
      setaAminUrl(1);
     }
  }, [token]);  

  const handleLogout = () => {
    Cookies.remove('token');
    signOut({ callbackUrl: '/login', redirect: true });
  };

  return (
    <header className="flex justify-between items-center pl-3 w-full">
      <nav className='header_menu'>
        <Link href='/coach/dashboard'>
          <span className={`hover:text-gray-400 ${currentPath === '/coach/dashboard' ? 'font-bold' : ''}`}>Dashboard</span>
          <span className='menu_line'>|</span>
        </Link>
        <Link href='/contact-us'>
          <span className={`hover:text-gray-400 ${currentPath === '/contact-us' ? 'font-bold' : ''}`}>Contacts</span>
          <span className='menu_line'>|</span>
        </Link>
        <Link href='/bookings'>
          <span className={`hover:text-gray-400 ${currentPath === '/bookings' ? 'font-bold' : ''}`}>Bookings</span>
          <span className='menu_line'>|</span>
        </Link>

        {/* Conditional rendering for Time Blocks and Admin based on role */}
        {role !== null && role !== 2 ?(
          <>
            <Link href='/time-block'>
              <span className={`hover:text-gray-400 ${currentPath === '/time-block' ? 'font-bold' : ''}`}>Time Blocks</span>
              <span className='menu_line'></span>
            </Link>
          </>
        ) : (
          <>
          <Link href='/time-block'>
            <span className={`hover:text-gray-400 ${currentPath === '/time-block' ? 'font-bold' : ''}`}>Time Blocks</span>
            <span className='menu_line'>|</span>
          </Link>
          <Link href='/admin/dashboard'>
          <span className={`hover:text-gray-400 ${adminUrl === 1 ? 'font-bold' : ''}`}>Admin</span>
          </Link>
        </>
        )}
      </nav>
      {/* <BurgerMenu /> */}
      <button onClick={handleLogout} className="font-bold py-2 px-4 rounded">Logout</button>
    </header>
  );
};

export default CoachHeader;
