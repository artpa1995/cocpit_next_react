"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import Header from '../components/GoustHeader';
import Footer from '../components/GoustFooter';
import { ClipLoader } from 'react-spinners';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gmailLogin, setGmailLogin] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  
  const [loginProcess, setLoginProcess] = useState(false);

  useEffect(() => {
    if (session && session.user && session.user.email) {
      setEmail(session.user.email);
      setGmailLogin(true);
      setLoginProcess(true);
      if(session.user.email){
        handleSubmit();
      }
    }
  }, [session, email]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if(email != ''){
      setLoginProcess(true)
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, gmailLogin }),
      });

      const data = await response.json();    
      
      if (data.message && data.message.status === 1) {
        router.push('/question');
      } else if (data.message && data.message.status === 2) {
        router.push('/profile');
      } else {
        router.push('/registration');
      }
      if(data){
        setLoginProcess(false)
      }
    }
  };

  const handleClick = () => {
    signIn();
  };

  return (
    <div className='flex h-full flex-col justify-between'>
    <Header />
      <div className='flex justify-center mt-5 mb-4'>
        <div>
          <h1 className='text-center font-bold'>Login</h1>
          <button
              onClick={handleClick}
              className="w-full flex items-center font-semibold justify-center h-14 px-6 mt-4 text-xl transition-colors duration-300 bg-white border-2 border-black text-black rounded-lg focus:shadow-outline hover:bg-slate-200"
          >      
            <svg xmlns="http://www.w3.org/2000/svg" width="45px" height="45px" viewBox="-3 0 262 262" preserveAspectRatio="xMidYMid"><path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4"/><path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853"/><path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05"/><path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335"/></svg>
            <span className="ml-4">Continue with Email</span>
          </button>
          <form onSubmit={handleSubmit} className='mt-6'>
           
            <div className='flex justify-center mt-5'>
              <input 
                type="email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Email" 
                className='rounded-lg px-5 py-3 border border-grey-600'  
                autoComplete="email"
              />
            </div>
            <div className='flex justify-center mt-5'>
              <input 
                className='rounded-lg px-5 py-3 border border-grey-600 ' 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Password" 
                autoComplete="password" 
              />
      
            </div>
            <div className="flex justify-center mt-5">

              {loginProcess ?(
                 <ClipLoader color={'#123abc'} loading={loginProcess} size={35} />
              ) : (
                  <button type="submit" className='text-white bg-sky-900 rounded-lg px-5 py-3'>Login</button>
              )}
              
            </div>
            <div className='flex justify-center mt-5'>
              <Link className='text-center font-medium text-blue-400' href="/registration">Registration</Link>
            </div>
          </form>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default Login;
