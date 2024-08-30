

import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">Admin Panel</div>
        <div className="flex space-x-4">
          <Link href="/admin/dashboard">
            <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              Dashboard
            </a>
          </Link>
          <Link href="/admin/users">
            <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              Users
            </a>
          </Link>
          <Link href="/admin/questions">
            <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              Questions
            </a>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
