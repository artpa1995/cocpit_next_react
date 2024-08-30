"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  }, [session]);

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

     
      if(data.message && data.message.role === 2){
        router.push('/admin/dashboard');
      }else{
        if (data.message && data.message.status === 1) {
          router.push('/question');
        } else if (data.message && data.message.status === 2) {
          router.push('/profile');
        } else {
          router.push('/registration');
        }
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
          <h1 className='text-center font-bold'>Admin Login</h1>
          
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
                autoComplete="new-password" 
              />
            </div>
            <div className="flex justify-center mt-5">

              {loginProcess ?(
                 <ClipLoader color={'#123abc'} loading={loginProcess} size={35} />
              ) : (
                  <button type="submit" className='text-white bg-sky-900 rounded-lg px-5 py-3'>Login</button>
              )}
              
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
