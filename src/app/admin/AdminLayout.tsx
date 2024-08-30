
import { ReactNode } from 'react';
import Header from '../components/admin/AdminHeader';
import Footer from '../components/admin/AdminFooter';

import Sidebar from './Sidebar';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
      <div className='flex h-full'>
        
        <Sidebar  />
          <div className=' page-content'>
            <Header />
            
            { children }
          </div>
        
      </div>
  );
};

export default AdminLayout;
