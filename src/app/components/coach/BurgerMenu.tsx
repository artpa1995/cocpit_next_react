"use client";
import { useState } from 'react';

import { usePathname } from 'next/navigation'
import Link from 'next/link';

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname()
  const currentPath = pathname;
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='a'>
      <div className="flex items-center justify-between p-5 bg-gray-800 text-white">
     
        <div className="">
          <button onClick={toggleMenu} className="focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
              />
            </svg>
          </button>
        </div>
      </div>
      <div className={` ${isOpen ? 'block' : 'hidden'} absolute z-10 bg-gray-800 text-white p-5`}>
        <Link 
          href="/profile"
          className={`block py-2 hover:text-gray-400 ${currentPath === '/profile' ? 'border-b-2 border-white' : ''}`}
          onClick={toggleMenu}
        >
          Profile
        </Link>
        <Link className="block py-2 hover:text-gray-400" onClick={toggleMenu} href="/coach/dashboard">Dashboard</Link>
        <Link className="block py-2 hover:text-gray-400" onClick={toggleMenu} href="/clients">Clients</Link>
        <Link className="block py-2 hover:text-gray-400" onClick={toggleMenu} href="/company">Company</Link>
        <Link className="block py-2 hover:text-gray-400" onClick={toggleMenu} href="/services">Services</Link>
        <Link className="block py-2 hover:text-gray-400" onClick={toggleMenu} href="/contact-us">Contact Us</Link>
      </div>
    </div>
  );
};

export default BurgerMenu;
