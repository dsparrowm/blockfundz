import { hamburger, logo } from '../assets/icons';
import { navLinks } from '../constants';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Nav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('nav')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const scrollToSection = (sectionId) => {
    if (isHomePage) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/#${sectionId}`);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className='padding-x py-4 w-full bg-coral-black fixed z-50 top-0'>
      <nav className='max-container relative'>
        <div className='flex items-center justify-between'>
          {/* Logo Section */}
          <div className='flex items-center gap-1'>
            <Link to="/" className='hidden lg:block'>
              <img 
                src={logo} 
                alt="Logo" 
                className='w-[60px] h-auto md:w-[80px]' 
              />
            </Link>
            <p className='text-lg md:text-xl lg:text-[34px] text-white leading-10'>
              Block<span className='text-orange-500'>Fundz</span>
            </p>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center gap-4 lg:gap-16'>
            <ul className='flex items-center gap-4 lg:gap-16 text-white-400'>
              {navLinks.map(item => (
                <li key={item.label}>
                  {item.href.startsWith('#') ? (
                    <button
                      onClick={() => scrollToSection(item.href.substring(1))}
                      className='font-montserrat text-sm md:text-base lg:text-lg text-white hover:text-orange-500 transition-colors'
                    >
                      {item.label}
                    </button>
                  ) : (
                    <Link 
                      to={item.href} 
                      className='font-montserrat text-sm md:text-base lg:text-lg text-white hover:text-orange-500 transition-colors'
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            
            <div className='flex items-center gap-2 md:gap-4 lg:gap-10'>
              <Link to="/login" className='font-montserrat text-sm md:text-base lg:text-lg text-white hover:text-orange-500 transition-colors'>
                Sign In
              </Link>
              <Link to="/signup" className='font-montserrat text-sm md:text-base lg:text-lg text-white bg-orange-500 hover:bg-orange-600 px-2 md:px-4 py-1 md:py-2 rounded-lg transition-colors'>
                Sign Up
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className='hidden md:block lg:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors text-white'
            aria-label="Toggle mobile menu"
          >
            <img src={hamburger} alt="" className='w-6 h-6 filter invert' />
          </button>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`absolute top-full left-0 right-0 bg-coral-black shadow-lg transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
          } md:hidden`}
        >
          <div className='p-4'>
            <ul className='flex flex-col gap-4'>
              {navLinks.map(item => (
                <li key={item.label}>
                  {item.href.startsWith('#') ? (
                    <button
                      onClick={() => scrollToSection(item.href.substring(1))}
                      className='w-full text-left font-montserrat text-lg text-white hover:text-orange-500 transition-colors'
                    >
                      {item.label}
                    </button>
                  ) : (
                    <Link 
                      to={item.href}
                      className='block font-montserrat text-lg text-white hover:text-orange-500 transition-colors'
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
              <li className='pt-4 border-t border-gray-700'>
                <Link 
                  to="/login"
                  className='block font-montserrat text-lg text-white hover:text-orange-500 transition-colors'
                >
                  Sign In
                </Link>
              </li>
              <li className='pt-2'>
                <Link 
                  to="/signup"
                  className='block font-montserrat text-lg text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg text-center transition-colors'
                >
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Nav;