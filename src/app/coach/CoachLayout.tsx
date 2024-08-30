
import { ReactNode } from 'react';
import Header from '../components/coach/CoachHeader';
import Footer from '../components/coach/CoachFooter';

import Sidebar from './Sidebar';

interface CoachLayoutProps {
  children: ReactNode;
}

const CoachLayout = ({ children }: CoachLayoutProps) => {
  const mainStyle = {
  
  };
  return (
    <div className='flex h-full'>
   
    <Sidebar  />
      <div className=' page-content' style={mainStyle}>
        <Header />
        
        { children }
      </div>
   
  </div>
  );
};

export default CoachLayout;