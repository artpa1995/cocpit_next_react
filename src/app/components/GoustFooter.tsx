import Link from 'next/link';

const GoustFooter = () => {
    return (
      <footer className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl">
          <nav>
            <Link href="/">Cockpit-Coach</Link>
          </nav>
        </h1>
      </footer>
    );
  };
  
  export default GoustFooter;