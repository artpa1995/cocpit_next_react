import Link from 'next/link';

const GoustHeader = () => {
    return (
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl">
          <nav>
            <Link href="/">Cockpit-Coach</Link>
          </nav>
        </h1>
    </header>
    );
  };
  
  export default GoustHeader;