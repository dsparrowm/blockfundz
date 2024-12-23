import { hamburger, logo } from '../assets/icons';
import { navLinks } from '../constants';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Nav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  const scrollToSection = (sectionId) => {
    // Only scroll if we're on the homepage
    if (isHomePage) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If not on homepage, navigate to homepage then scroll
      navigate(`/#${sectionId}`);
    }
  };

  return (
    <header className='padding-x py-4 w-full bg-coral-black fixed z-50 top-0'>
      <nav className='max-container flex justify-between items-center'>
        <div className='flex items-center gap-1'>
          <Link to="/">
            <img src={logo} alt="Logo" width={80} height={13} />
          </Link>
          <p className='text-[34px] text-white leading-10'>Block<span className='text-orange-500'>Fundz</span></p>
        </div>
        <ul className='flex justify-center text-white-400 items-center flex-1 gap-16 max-lg:hidden'>
          {navLinks.map(item => (
            <li key={item.label}>
              {item.href.startsWith('#') ? (
                <button
                  onClick={() => scrollToSection(item.href.substring(1))}
                  className='font-montserrat leading-normal text-lg text-white bg-transparent border-none cursor-pointer'
                >
                  {item.label}
                </button>
              ) : (
                <Link to={item.href} className='font-montserrat leading-normal text-lg text-white'>
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
        <div className='flex justify-end items-center gap-10'>
          <Link to="/login" className='font-montserrat leading-normal text-lg text-white'>
            Sign In
          </Link>
          <Link to="/signup" className='font-montserrat leading-normal text-lg text-white'>
            Sign Up
          </Link>
        </div>
        <div className='hidden max-lg:block'>
          <img src={hamburger} alt="Hamburger" width={25} height={25} />
        </div>
      </nav>
    </header>
  );
};

export default Nav;