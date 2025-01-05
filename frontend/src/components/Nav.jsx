import React, { useState, useEffect } from 'react';
import Button from './myButton';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Nav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isHomePage = location.pathname === '/' || location.pathname === '';
  
  const mainLinks = [
    { name: "Home", link: "/", hash: "home" },
    { name: "Service", link: "/", hash: "service" },
    { name: "About", link: "/", hash: "about" },
    { name: "Pricing", link: "/", hash: "pricing" },
    { name: "Contact", link: "/contact", hash: null },
  ];

  let [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [location]);

  const handleNavigation = (link, hash) => {
    if (hash) {
      if (isHomePage) {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        navigate(`/${hash ? '#' + hash : ''}`);
      }
    } else {
      navigate(link);
    }
    setOpen(false);
  };

  return (
    <div className='shadow-md w-full fixed top-0 left-0 z-50'>
      <div className='bg-coral-black py-4 px-7'>
        <div className='flex items-center justify-between'>
          {/* Logo - Left */}
          <Link to="/" className='flex-shrink-0'>
            <div className='font-bold text-2xl cursor-pointer flex items-center font-[Poppins] text-white'>
              <span className='text-3xl text-orange-500 mr-1 pt-2'>
                <ion-icon name="logo-ionic"></ion-icon>
              </span>
              BlockFundz
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <div onClick={() => setOpen(!open)} className='text-3xl absolute right-8 top-6 cursor-pointer md:hidden text-white'>
            <ion-icon name={open ? 'close' : 'menu-outline'}></ion-icon>
          </div>

          {/* Navigation Container */}
          <div className={`md:flex md:items-center absolute md:static bg-coral-black w-full md:w-auto left-0 
            ${open ? 'top-20' : 'top-[-490px]'} 
            md:flex-1 transition-all duration-500 ease-in
            ${open ? 'flex flex-col' : 'hidden md:flex'}`}>
            
            {/* Centered Navigation Links */}
            <ul className='md:flex md:items-center md:justify-center md:flex-1 pb-12 md:pb-0'>
              {mainLinks.map((link) => (
                <li key={link.name} className='md:mx-4 text-xl my-7 md:my-0 text-center'>
                  <a
                    className='text-white cursor-pointer hover:text-orange-500 transition-colors'
                    onClick={() => handleNavigation(link.link, link.hash)}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            {/* Right Side Actions */}
            <div className='md:flex md:items-center space-y-7 md:space-y-0 md:space-x-4 flex-shrink-0'>
              <a
                className='text-white cursor-pointer hover:text-orange-500 transition-colors text-xl block text-center md:inline'
                onClick={() => handleNavigation("/login", null)}
              >
                Login
              </a>
              <Link to="/signup" className='block text-center md:inline'>
                <Button>
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nav;