"use client";
import { useState, useEffect } from "react";
import Link from 'next/link';
import { Box, Modal} from "@mui/material";
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import Image from "next/image";
import { usePathname } from 'next/navigation';

import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import Profile from '../components/user/Profile';

interface DecodedToken {
  user: {
    id: number;
    first_name: string;
    last_name: string;
    role: number;
    avatar: string;
  };
} 

interface ItemProps {
  title: string;
  to: string;
  icon: JSX.Element;
  selected: string;
  setSelected: (value: string) => void;
  isCollapsed: boolean
}

const Sidebar = () => {
    const token = Cookies.get('token');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const pathname = usePathname();
    const currentPath = pathname;

    const handleCloseModal = () => {
      setModalOpen(false);
    };

    const [user, setUser] = useState<any>(null); 

    useEffect(() => {
      if (token) {
        let decodedToken: DecodedToken;
        decodedToken = jwtDecode<DecodedToken>(token);
      
        setFirstName(decodedToken.user.first_name || '');
        setLastName(decodedToken.user.last_name || '');
       
        if (decodedToken.user.avatar) {
            setAvatarUrl(decodedToken.user.avatar);
        } else {
            setAvatarUrl('/images/user/avatar.png');
        }
      }
            
  }, [token]);
  
  return (
    <div className="sidebar_content">
      <div className="  sidebar">
      
        <Link href={'/coach/dashboard'}> 
          <div className="logo"> 
            <Image className="logo_image"  alt="logo" src={'/images/logo.png'}  width={30} height={30}/>
            <div className="text-sm text_color"><span className="font-bold text-sm">cockpit</span><span>.coach</span></div>
          </div>
        </Link>
          <Box mb="25px" mt="25px">
            <Box display="flex" justifyContent="center" margin={'0 auto'} alignItems="center" width={100} height={100}>
              <Image
                src={avatarUrl || '/images/user/avatar.png'}
                alt="User Avatar"
                width={100} 
                height={100}
                className="rounded-full"
                style={{width:'100%', height:'100%', objectFit:'cover'}}
              />
            </Box>
            <div className="user_full_name">
              <span className="firstName">{firstName}</span>
              <span className="lastName">{lastName}</span>
              <span className="cursor-pointer" onClick={() => {setModalOpen(true)}}><SettingsIcon sx={{ color: '#9D9D9D' }} /></span>
            </div>
          </Box>


          <p className="admin_menu_title">Admin Menu</p>

          <div className="sidebar_section1">
            <div className="admin_menu_links">
              <div className="header_block">
                <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="#929292" viewBox="0 0 576 512"><path d="M249.6 471.5c10.8 3.8 22.4-4.1 22.4-15.5l0-377.4c0-4.2-1.6-8.4-5-11C247.4 52 202.4 32 144 32C93.5 32 46.3 45.3 18.1 56.1C6.8 60.5 0 71.7 0 83.8L0 454.1c0 11.9 12.8 20.2 24.1 16.5C55.6 460.1 105.5 448 144 448c33.9 0 79 14 105.6 23.5zm76.8 0C353 462 398.1 448 432 448c38.5 0 88.4 12.1 119.9 22.6c11.3 3.8 24.1-4.6 24.1-16.5l0-370.3c0-12.1-6.8-23.3-18.1-27.6C529.7 45.3 482.5 32 432 32c-58.4 0-103.4 20-123 35.6c-3.3 2.6-5 6.8-5 11L304 456c0 11.4 11.7 19.3 22.4 15.5z"/></svg>
                <span>Learn</span>
              </div>
              <div className="links_block">
                <Link href='/admin/dashboard'>
                  <span className={`hover:text-sky-600 ${currentPath === '/admin/dashboard' ? 'font-bold text-sky-600' : ''}`}>Dashboard</span>
                </Link>
                <Link href='/coach/contacts'>
                  <span className={`hover:text-sky-600 ${currentPath === '/admin/contacts' ? 'font-bold text-sky-600' : ''}`}>Contacts</span>
                </Link>
                <Link href='/admin/bookings'>
                  <span className={`hover:text-sky-600 ${currentPath === '/admin/bookings' ? 'font-bold text-sky-600' : ''}`}>Bookings</span>
                </Link>
                <Link href='/admin/time-blocks'>
                  <span className={`hover:text-sky-600 ${currentPath === '/admin/time-blocks' ? 'font-bold text-sky-600' : ''}`}>Time Blocks</span>
                </Link>
                <Link href='/admin/questions'>
                  <span className={`hover:text-sky-600 ${currentPath === '/admin/questions' ? 'font-bold text-sky-600' : ''}`}>Questions</span>
                </Link>
                <Link href='/admin/users'>
                  <span className={`hover:text-sky-600 ${currentPath === '/admin/users' ? 'font-bold text-sky-600' : ''}`}>Users</span>
                </Link>
                <Link href='/admin/calendar'>
                  <span className={`hover:text-sky-600 ${currentPath === '/admin/calendar' ? 'font-bold text-sky-600' : ''}`}>Calendar</span>
                </Link>
              </div>
            </div>

            <div className="admin_menu_links">
              <div className="header_block">
                <svg xmlns="http://www.w3.org/2000/svg"  fill="#929292" version="1.1" id="Capa_1" width="20px" height="20px" viewBox="0 0 37.519 37.519" >
                  <g>
                    <path d="M37.087,17.705c-0.334-0.338-8.284-8.276-18.327-8.276S0.766,17.367,0.433,17.705c-0.577,0.584-0.577,1.523,0,2.107   c0.333,0.34,8.284,8.277,18.327,8.277s17.993-7.938,18.327-8.275C37.662,19.23,37.662,18.29,37.087,17.705z M18.76,25.089   c-6.721,0-12.604-4.291-15.022-6.332c2.411-2.04,8.281-6.328,15.022-6.328c6.72,0,12.604,4.292,15.021,6.332   C31.369,20.802,25.501,25.089,18.76,25.089z M18.76,13.009c3.176,0,5.75,2.574,5.75,5.75c0,3.175-2.574,5.75-5.75,5.75   c-3.177,0-5.75-2.574-5.75-5.75C13.01,15.584,15.583,13.009,18.76,13.009z"/>
                  </g>
                </svg>                
                <Link href='/admin/manitor'>
                  <span className={`hover:text-sky-600 ${currentPath === '/admin/manitor' ? 'font-bold text-sky-600' : ''}`}>Manitor</span>
                </Link>
              </div>
            </div>

            <div className="admin_menu_links">
              <div className="header_block">
              <svg xmlns="http://www.w3.org/2000/svg"  width={20} height={20} fill="#929292"  viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>               
                <Link href='/admin/to-dos'>
                  <span className={`hover:text-sky-600 ${currentPath === '/admin/to-dos' ? 'font-bold text-sky-600' : ''}`}>To Dos</span>
                </Link>
              </div>
            </div>

            <div className="admin_menu_links">
              <div className="header_block">
                <AccountBalanceOutlinedIcon sx={{ color: '#929292', width:'20px', height:'20px' }}  />     
                <Link href='/admin/currencies'>
                  <span className={`hover:text-sky-600 ${currentPath === '/admin/currencies' ? 'font-bold text-sky-600' : ''}`}>Currencies</span>
                </Link>
              </div>
            </div>

          </div>
      </div>
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Profile
          user={user}
          modalShow={modalOpen}
          onClose={handleCloseModal}
        />
      </Modal>
    </div>
);
};

export default Sidebar;
