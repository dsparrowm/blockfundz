import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Bitcoin, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { crypto_logo } from "../../assets/icons";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', href: '#' },
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Team', href: '#team' },
    { name: 'About', href: '#about' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {crypto_logo ? (
              <img src={crypto_logo} alt="NexGen Logo" className="w-6 h-6 " />
            ) : (
              <Bitcoin className="w-6 h-6 text-white" />
            )}
            <span className="text-xl font-bold text-gradient">NexGen</span>
          </div>
          {/* <div className="flex items-center justify-center space-x-3 mb-5 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-crypto-gradient rounded-lg flex items-center justify-center">
              {logo ? (
                <img src={logo} alt="NexGen Logo" className="w-6 h-6 " />
              ) : (
                <Bitcoin className="w-6 h-6 text-white" />
              )}
            </div>
            <span className="text-3xl text-white font-bold">
              Nex<span className="text-crypto-blue">Gen</span>
            </span>
          </div> */}

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-crypto-blue transition-colors duration-300 relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-crypto-blue transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <a href="/login">
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Login
              </Button>
            </a>
            <Button
              className="crypto-button text-white px-6 py-2 rounded-lg font-semibold"
              onClick={() => navigate("/signup")}
            >
              Start Investing
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 glass-card p-4 rounded-lg">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:text-crypto-blue transition-colors duration-300 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-white/10">
                <a href="/login">
                  <Button variant="ghost" className="text-gray-300 hover:text-white justify-start">
                    <User className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </a>
                <Button
                  className="crypto-button text-white rounded-lg font-semibold"
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate("/signup");
                  }}
                >
                  Start Investing
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
