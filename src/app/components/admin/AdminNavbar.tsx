// src/components/Navbar.tsx

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react';

const Navbar = () => {
  const pathname = usePathname();
  return (
    <div>
      <nav className="">
        <div className="container">
          <div className="text-black text-lg font-bold mt-5">Admin Panel</div>
          <div className="">
            <div className={`hover:bg-gray-700 hover:text-white ${pathname === '/admin/dashboard' ? 'bg-gray-700 text-white' : 'text-gray-300'}`}>
              <Link href="/admin/dashboard" className="px-3 py-2 rounded-md text-sm font-medium">
                Dashboard
              </Link>
            </div>
            <div className={`hover:bg-gray-700 hover:text-white ${pathname === '/admin/users' ? 'bg-gray-700 text-white' : 'text-gray-300'}`}>
              <Link href="/admin/users" className="px-3 py-2 rounded-md text-sm font-medium">
                Users
              </Link>
            </div>
            <div className={`hover:bg-gray-700 hover:text-white ${pathname === '/admin/questions' ? 'bg-gray-700 text-white' : 'text-gray-300'}`}>
              <Link href="/admin/questions" className="px-3 py-2 rounded-md text-sm font-medium">
                Questions
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
