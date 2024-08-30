"use client";
import AdminLayout from './AdminLayout';

const AdminDashboard = () => {
  return (
      <AdminLayout>
        <div className='flex justify-center  w-full  '    style={{backgroundColor: '#141b2d'}} >
          <h1 className='mt-5 text-white font-bold'>Admin Dashboard</h1>
        </div>
      </AdminLayout>
  );
};

export default AdminDashboard;