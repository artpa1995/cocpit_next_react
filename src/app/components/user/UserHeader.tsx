"use client";
import React from 'react';
import Cookies from 'js-cookie';
import { signOut } from "next-auth/react"
import Link from 'next/link';

const UserHeader: React.FC = () => {

  const handleLogout = () => {
    Cookies.remove('token');
    signOut({ callbackUrl: '/login', redirect:true })
  };
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl">
        <nav>
          <Link href="/">Cockpit-Coach</Link>
        </nav>
      </h1>
      <nav>
          <Link href="/profile">Profile</Link>
        </nav>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Logout
      </button>
    </header>
  );
};

export default UserHeader;
