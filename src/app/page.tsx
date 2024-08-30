"use client";

import Link from 'next/link';
import Cookies from 'js-cookie';
import { useEffect, useState } from "react";
import GoustHeader from './components/GoustHeader';
import UserHeader from './components/user/UserHeader';
import GoustFooter from './components/GoustFooter';
import UserFooter from './components/user/UserFooter';
import { useSession } from 'next-auth/react';
import axios from "axios";

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [header, setHeader] = useState(<GoustHeader />);
  const [footer, setFooterr] = useState(<GoustFooter />);
  const { data: session } = useSession();
  const [ start, setStart ] = useState(new Date());
  const [ end, setEnd ] = useState(new Date());

  const [googleEvents, setGoogleEvents] = useState([]);
  const fetchGoogleEvents = async () => {
    try {
      const response = await axios.post('/api/google-calendar',{session:session});
        setGoogleEvents(response.data || []);
      } catch (error) {
          console.error('Error fetching companies:', error);
      }
  };

  useEffect(() => {
    const storedToken = Cookies.get('token');
    if (storedToken) {
      setToken(storedToken);
      setHeader(<UserHeader />);
      setFooterr(<UserFooter />);
    }
    
    if(session){
      fetchGoogleEvents()
    }
    
  }, [session]);

  return (
    <div className='flex min-h-screen flex-col  justify-between'>
      {header}
      <main className=" flex flex-col items-center">
        <h1>Home Page</h1>
        <nav className="mt-5 flex flex-col items-center gap-4 ">
          {!token ? (
            <>
              <Link href="/login">Login</Link>
              <Link href="/registration">Registration</Link>
            </>
          ) : (
            <>
              <Link href="/profile">Profile</Link>
            </>
          )}
              <Link href="/contact-us">Contact Us</Link>
        </nav>
      </main>
      {footer}
    </div>
  );
}
