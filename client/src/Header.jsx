
import { useContext, useEffect, useState,useRef } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(UserContext);
  let menuRef=useRef();
  useEffect(()=>{
    let handler=(e)=>{
      if(!menuRef.current.contains(e.target)){
        setIsOpen(false);
        console.log(menuRef.current);
      }
    }
    document.addEventListener("mousedown",handler);
    return()=>{
      document.removeEventListener("mousedown",handler);
    }
  });
  return (
    <header className='flex justify-between'>
      <Link to={'/'} className="flex items-center gap">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
        </svg>
        <span className='font-bold text-xl'>TravelNest</span>
      </Link>
      <div className='hidden md:flex gap-2 border border-gray-300 rounded-full px-4 py-2 shadow-md shadow-gray-300'>
        <div>Anywhere</div>
        <div className='border-l border-gray-300'></div>
        <div>Anyweek</div>
        <div className='border-l border-gray-300'></div>
        <div>Add guests</div>
        <button className='bg-primary text-white p-2 rounded-full'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </button>
      </div>
      <Link to={user ? null : '/login'} className='flex items-center gap-2 border border-gray-300 rounded-full md:px-4 px-2 py-2 shadow-sm'>
        <button onClick={() => setIsOpen((prev) => !prev)} className="bg-white" ref={menuRef}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
          {!!isOpen && !!user && (
            <div className="flex flex-col justify-between absolute top-16 md:top-20 right-15 z-10 bg-white divide-y divide-gray-100 rounded-xl drop-shadow-md shadow w-40 dark:bg-gray-700 dark:divide-gray-600">
              <Link to={'/account'} className="flex gap-2 items-center block px-4 py-2 hover:rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
              
                <div className='bg-black-400 overflow-hidden'>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>Profile</div>
              </Link>
              <Link to={'/account/bookings'} className="flex block px-4 py-2 hover:bg-gray-100 hover:rounded-xl dark:hover:bg-gray-600 dark:hover:text-white">My Bookings</Link>
              <Link to={'/account'} className="flex block px-4 py-2 hover:bg-gray-100 hover:rounded-xl dark:hover:bg-gray-600 dark:hover:text-white">Logout</Link>
            </div>
          )}
        </button>


        {!!user && (
          <div>
            <Link to={'/account'}>{user.name}</Link>
          </div>
        )}
      </Link>
    </header>
  );
}