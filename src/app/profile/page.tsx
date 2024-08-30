"use client";

import { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import Image from "next/image";
import axios from 'axios';
import CoachLayout from '../coach/CoachLayout';
import { JwtPayload } from "jwt-decode";

interface UserPayload extends JwtPayload {
  user: {
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    avatar?: string;
  };
}

const ProfilePage = () => {

  const [email, setemail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const token = Cookies.get('token');


  useEffect(() => {
    if (token) {
      
      const decodedToken = jwtDecode<UserPayload>(token);
      setFirstName(decodedToken.user.first_name || '');
      setLastName(decodedToken.user.last_name || '');
      setPhone(decodedToken.user.phone || '');
      setemail(decodedToken.user.email || '');      

      if (decodedToken.user.avatar) {
        setAvatarUrl(decodedToken.user.avatar);
      } else {
        setAvatarUrl('/images/user/avatar.jpg');
      }
    }
  }, [token]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setAvatar(file);
      setAvatarUrl(URL.createObjectURL(file));
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post('/api/user/changeAvatar', formData);
        if (response.status === 200) {
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('phone', phone);
    if (avatar) {
      formData.append('avatar', avatar);
    }
    formData.append('password', password);

    try {
      const response = await axios.post('/api/user/profile', formData);

      if (response.status === 200) {
        alert('Your Profile Updated')
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <CoachLayout>
        <div className='flex h-full w-full flex-col justify-between'>
          <div className='flex justify-center mt-5 mb-5'>
            <form onSubmit={handleSubmit}>
              <h1 className='font-bold text-center'>Profile</h1>
              
              <div className="mt-5 flex items-center justify-center">
                <div onClick={handleAvatarClick} className="cursor-pointer  ">
                  <Image
                    src={avatarUrl || '/images/user/avatar.jpg'}
                    alt="User Avatar"
                    className="rounded-full"
                    width={100}
                    height={100}
                  />
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </div>

              <div  className='rounded-lg px-5 py-3 border border-grey-600 mt-5' >
                {email }
              </div>

              <div>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  className='rounded-lg px-5 py-3 border border-grey-600 mt-5' 
                />
              </div>
            
              <div>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  className='rounded-lg px-5 py-3 border border-grey-600 mt-5' 
                />
              </div>
              <div>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone"
                    autoComplete="phone"
                    className='rounded-lg px-5 py-3 border border-grey-600 mt-5' 
                  />
                </div>

              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  autoComplete="new-password"
                  className='rounded-lg px-5 py-3 border border-grey-600 mt-5' 
                />
              </div>
            
              <div className="flex justify-center mt-5">
                <button type="submit" className='text-white bg-sky-900 rounded-lg px-5 py-3'>Save</button>
              </div>
            </form>
          </div>
        </div>
      </CoachLayout>
  );
};

export default ProfilePage;
