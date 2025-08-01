import { useState } from 'react';
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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/98 backdrop-blur-md border-b border-gray-700 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <NexGenLogo variant="full" size="sm" />
          </div>

          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-purple-400 transition-colors duration-200 relative group font-medium text-sm"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-200 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center space-x-3">
            <a href="/talk-to-sales">
              <Button variant="ghost" className="text-gray-300 hover:text-gray-100 hover:bg-gray-800 font-medium text-sm px-4 py-2">
                TALK TO SALES
              </Button>
            </a>
            <a href="/login">
              <Button variant="ghost" className="text-gray-300 hover:text-gray-100 hover:bg-gray-800 font-medium text-sm px-4 py-2">
                SIGN IN
              </Button>
            </a>
            <Button
              className="bg-purple-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-purple-700 shadow-sm text-sm transition-all duration-200 hover:-translate-y-0.5"
              onClick={() => navigate("/signup")}
            >
              TRY FOR FREE
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-gray-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden mt-4 bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 animate-fade-in">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:text-purple-400 transition-colors duration-200 py-2 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-700">
                <a href="/talk-to-sales">
                  <Button variant="ghost" className="text-gray-300 hover:text-gray-100 justify-start w-full font-medium">
                    TALK TO SALES
                  </Button>
                </a>
                <a href="/login">
                  <Button variant="ghost" className="text-gray-300 hover:text-gray-100 justify-start w-full font-medium">
                    SIGN IN
                  </Button>
                </a>
                <Button
                  className="bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 w-full py-3"
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
        )}
      </div>
    </header>
  );
};

export default Header;
