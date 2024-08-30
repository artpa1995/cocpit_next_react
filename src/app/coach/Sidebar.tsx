"use client";
import { useState, useEffect } from "react";
import Link from 'next/link';
import { Box, IconButton, Typography, useTheme, Modal } from "@mui/material";
import axios from 'axios';
import SettingsIcon from '@mui/icons-material/Settings';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import SidebarSettings from '../components/coach/SidebarSettings'
import { useDispatch } from 'react-redux';
import { setActiveClients  } from '../../store/ActiveClients';
import { setLTV  } from '../../store/LTV';
import { setItemWithExpiration, getItemWithExpiration } from '@/helpers/Helpers';
import Profile from '../components/user/Profile';

interface DecodedToken {
  user: {
    id: number;
    first_name: string;
    last_name: string;
    role: number;
    phone: number;
    email: string;
    avatar: string;
    currency?: number;
  };
} 

interface ItemProps {
  title: string;
  to: string;
  icon: JSX.Element;
  selected: string;
  setSelected: (value: string) => void;
  isCollapsed: boolean;
}

interface Currency {
  id: string;
  name: string;
  icon: string;
}

const Sidebar = () => {
    const dispatch = useDispatch();
    const [modalOpen, setModalOpen] = useState(false);
    const token = Cookies.get('token');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [role, setRole] = useState(1);
    const [user, setUser] = useState<any>(null); 
    const [activeButton, setActiveButton] = useState<string>('To Do');
    const [nextStep, setNextStep] = useState(true);
    const [showToDo, setShowToDo] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [shoCommunity, setShoCommunity] = useState(true);
    const [activeClient, setActiveClient] = useState(true);
    const [currency, setCurrency] = useState<Currency | null>(null);
    const [showfilters, setshowfilters] = useState(false);

    // const [LTV, setLTV] = useState<any>(null); 

    const handleCloseModal = () => {
      setModalOpen(false);
    };

    const [pageData, setPageData] = useState<{
      dashboard_title: string;
      dashboard_description: string;
      dashboard_button_text: string;
      dashboard_button_link: string;
      dashboard_video: string;
    } | null>(null);

    const fetchPageData = async () => {
      try {
        const response = await axios.get(`/api/page_info/get_page_info/3`);
        setPageData(response.data || null);
      } catch (error) {
        console.error('Error fetching page info:', error);
      }
    };

    const handleButtonClick = (buttonName: string) => {
      setActiveButton(buttonName);
      setShowToDo(false);
      setShowSettings(false);
      setShoCommunity(false);
      setshowfilters(false);

      if(buttonName === 'To Do' || buttonName === 'slide-simple'){
        setShowToDo(true);
        if(buttonName === 'slide-simple'){
          setshowfilters(true);
        }
      }else if(buttonName === 'Settings'){
        setShowSettings(true);
      } else if(buttonName === 'Community'){
        setShoCommunity(true);
      }
    };

    const handleContact_gmail = () => {
      setItemWithExpiration('Contact_gmail', '1', 1);
    };

    const getItemWithExpirationValue = getItemWithExpiration('Contact_gmail');

    const getLTV = async () => {
      try {
        const response = await axios.post('/api/clients/getLTV');
        let LTV = response.data;
        dispatch(setLTV(LTV));
      } catch (error) {
        console.error('Error fetching users:', error);
      } 
    };

    const getActiveClient = async () => {
      try {
        const response = await axios.post('/api/clients/getUserClients/activeClient');
        const clientsCount = response.data.clientsCount;

        setActiveClient(clientsCount);
        dispatch(setActiveClients(clientsCount));

      } catch (error) {
        console.error('Error fetching users:', error);
      } 
    };

    const getCurrency = async (id: number) => {
      try {
        const response = await axios.get(`/api/currency/${id}`);
  
        if(response && response.data && response.data.currency){
          setCurrency(response.data.currency); 
        }
      } catch (error) {
        console.error('Error currency:', error);
      }
    };

    useEffect(() => {
      fetchPageData();
      if (token) {
        let decodedToken: DecodedToken;
        decodedToken = jwtDecode<DecodedToken>(token);
        setUser(decodedToken.user);
      
        setFirstName(decodedToken.user.first_name || '');
        setLastName(decodedToken.user.last_name || '');
        setRole(decodedToken.user.role || 1);
        if (decodedToken.user.avatar) {
            setAvatarUrl(decodedToken.user.avatar);
        } else {
            setAvatarUrl('/images/user/avatar.png');
        }

        if(decodedToken.user.currency){
          getCurrency(decodedToken.user.currency);   
        }
      }

      if (window.innerWidth <= 768) {
        setIsCollapsed(true);
      }

      getActiveClient();
      getLTV();
              
    }, [token]);
  

    return (
      <div className="sidebar_content">
        <div className="sidebar">
          <Link href={'/coach/dashboard'}> 
            <div className="logo"> 
              <Image className="logo_image" alt="logo" src={'/images/logo.png'} width={30} height={30}/>
              <div className="text-sm text_color"><span className="font-bold text-sm">cockpit</span><span>.coach</span></div>
            </div>
          </Link>
          <Box mb="25px" mt="25px">
            <Box display="flex" justifyContent="center" margin={'0 auto'} alignItems="center" width={100} height={100}>
              <Image
                src={avatarUrl || '/images/user/avatar.png'}
                alt="User Avatar"
                className="rounded-full"
                width={100}
                height={100}
                style={{width:'100%', height:'100%', objectFit:'cover'}}
              />
            </Box>
            <div className="user_full_name">
              <span className="firstName">{firstName}</span>
              <span className="lastName">{lastName}</span>
              <span className="cursor-pointer" onClick={() => {setModalOpen(true)}}><SettingsIcon sx={{ color: '#9D9D9D' }} /></span>
            </div>
          </Box>

          <div className="sidebar_section1">
            <div className="settings_buttons_block">
              <button 
                className={`buttons ${activeButton === 'To Do' ? 'active' : ''}`} 
                onClick={() => handleButtonClick('To Do')}
              >
                To Do
              </button>
              <button 
                className={`buttons ${activeButton === 'Settings' ? 'active' : ''}`} 
                onClick={() => handleButtonClick('Settings')}
              >
                  Settings
              </button>
              <button 
                  className={`buttons ${activeButton === 'Community' ? 'active' : ''}`} 
                  onClick={() => handleButtonClick('Community')}
              >
                  Community
              </button>
              {showToDo && (
              <button
                className={`buttons toDosetting_button ${activeButton === 'slide-simple' ? 'active' : ''}`} 
                onClick={() => handleButtonClick('slide-simple')}
              >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
                      <path d="M8 8.5C8 9.88071 6.88071 11 5.5 11C4.11929 11 3 9.88071 3 8.5C3 7.11929 4.11929 6 5.5 6C6.88071 6 8 7.11929 8 8.5ZM8 8.5H21M16 15.5C16 16.8807 17.1193 18 18.5 18C19.8807 18 21 16.8807 21 15.5C21 14.1193 19.8807 13 18.5 13C17.1193 13 16 14.1193 16 15.5ZM16 15.5H3" stroke="#9D9D9D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
              </button> 
              )}
            </div>

            {showfilters && (
                <div className="next_step">
                  <p className="dollar">
                    
                  </p>
                  <div className="text">
                    Filters
                  </div>
                </div>
            )}

            {showToDo && (
              <div className="todoSection">
                {!activeClient && !getItemWithExpirationValue && pageData && (
                   <div className="contact_gmail" onClick={() => handleContact_gmail()} >
                      <span
                        style={{
                          color:'#FF9900',
                          fontSize: '35px', 
                          width:'35px', 
                          display: 'flex', 
                          justifyContent: 'center'
                        }}
                        dangerouslySetInnerHTML={{ __html: pageData.dashboard_title }} 
                      />
                      <div className="text">
                        {pageData && pageData.dashboard_video}
                      </div>
                      <div className="cirkul"></div>
                  </div>
                )} 

                {nextStep && (
                    <div className="next_step">
                      <p className="dollar">
                        {currency && currency.icon && (
                          <span dangerouslySetInnerHTML={{ __html: currency.icon }} />
                        )}
                      </p>
                      <div className="text">
                        How did it go with Frank yesterday? Any next steps?
                      </div>
                      <CloseIcon sx={{ cursor: 'pointer', fontSize: '18px' }} onClick={() => setNextStep(false)} />
                    </div>
                )}
                <div className="more_client">
                  <CalendarMonthIcon sx={{ color: '#929292', fontSize:'35px' }}  />
                  <div className="text">
                    It looks like you need to schedule more client acquisition blocks
                  </div>
                  <div className="cirkul"></div>
                </div>
              </div>
            )}
            {showSettings && (
              <div className="sidebarSettingsBlock">
                  <SidebarSettings />
              </div>
            )}
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
