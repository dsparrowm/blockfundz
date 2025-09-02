import { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NexGenLogo from "../ui/NexGenLogo";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', href: '#' },
    { name: 'Features', href: '#features' },
    { name: 'Resources', href: '#resources' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Company', href: '#our-team' }
  ];

  const headerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!headerRef.current) return;
      // close only when click is outside both header and the menu panel
      const target = e.target as Node;
      const clickedInsideHeader = headerRef.current.contains(target);
      const clickedInsideMenu = menuRef.current ? menuRef.current.contains(target) : false;
      if (isMenuOpen && !clickedInsideHeader && !clickedInsideMenu) {
        setIsMenuOpen(false);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };

    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [isMenuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    // Smooth scroll for anchor links
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-700 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 relative" ref={headerRef}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2 z-10 relative">
            <NexGenLogo variant="full" size="lg" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-purple-400 transition-colors duration-200 relative group font-medium text-sm"
                onClick={(e) => {
                  if (item.href.startsWith('#')) {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }
                }}
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <a href="/talk-to-sales">
              <Button variant="ghost" className="text-gray-300 hover:text-gray-100 hover:bg-gray-800 font-medium text-sm px-4 py-2 transition-all duration-200">
                TALK TO SALES
              </Button>
            </a>
            <a href="/login">
              <Button variant="ghost" className="text-gray-300 hover:text-gray-100 hover:bg-gray-800 font-medium text-sm px-4 py-2 transition-all duration-200">
                SIGN IN
              </Button>
            </a>
            <Button
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-2.5 rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 shadow-lg text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
              onClick={() => navigate("/signup")}
            >
              TRY FOR FREE
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-200 z-10 relative"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40">
            {/* Backdrop with animation */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
              onClick={() => setIsMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Mobile Menu Panel */}
            <div
              ref={menuRef}
              className="absolute top-16 left-4 right-4 bg-gray-800/95 backdrop-blur-md border border-gray-600 rounded-2xl shadow-2xl p-6 mx-auto max-w-sm animate-in slide-in-from-top-2 duration-300"
            >
              {/* Navigation Links */}
              <nav className="flex flex-col space-y-1">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-300 hover:text-purple-400 hover:bg-gray-700/50 transition-all duration-200 py-3 px-4 rounded-lg font-medium"
                    onClick={(e) => {
                      if (item.href.startsWith('#')) {
                        e.preventDefault();
                        handleNavClick(item.href);
                      } else {
                        setIsMenuOpen(false);
                      }
                    }}
                  >
                    {item.name}
                  </a>
                ))}

                {/* Mobile CTA Buttons */}
                <div className="pt-4 border-t border-gray-600 mt-4 space-y-3">
                  <a href="/talk-to-sales" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      className="text-gray-300 hover:text-gray-100 hover:bg-gray-700 justify-start w-full font-medium text-sm py-3 transition-all duration-200"
                    >
                      TALK TO SALES
                    </Button>
                  </a>

                  <a href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      className="text-gray-300 hover:text-gray-100 hover:bg-gray-700 justify-start w-full font-medium text-sm py-3 transition-all duration-200"
                    >
                      SIGN IN
                    </Button>
                  </a>

                  <Button
                    className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 w-full py-3 text-sm shadow-lg transition-all duration-200 hover:shadow-xl"
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/signup");
                    }}
                  >
                    TRY FOR FREE
                  </Button>
                </div>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;