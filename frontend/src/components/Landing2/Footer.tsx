import { Bitcoin, Youtube, Shield, FileText } from 'lucide-react';
import { crypto_logo } from "../../assets/icons"

const Footer = () => {
  return (
    <footer className="border-t border-white/10">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              {crypto_logo ? (
                <img src={crypto_logo} alt="NexGen Logo" className="w-9 h-9 " />
              ) : (
                <Bitcoin className="w-6 h-6 text-orange" />
              )}
              <span className="text-xl font-bold text-orange">NexGen</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-sm">
              The future of crypto investment. Join millions of users building wealth with
              advanced investment tools and bank-level security.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-orange text-sm">
                <Shield className="w-4 h-4 text-[#10B981]" />
                <span className='text-[#10B981]'>Regulated & Secure</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-orange transition-colors duration-300">Investments</a></li>
              <li><a href="#" className="text-gray-400 hover:text-orange transition-colors duration-300">Portfolio</a></li>
              <li><a href="#" className="text-gray-400 hover:text-orange transition-colors duration-300">Markets</a></li>
              <li><a href="#" className="text-gray-400 hover:text-orange transition-colors duration-300">Staking</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Learn</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-orange transition-colors duration-300">Crypto Basics</a></li>
              <li><a href="#" className="text-gray-400 hover:text-orange transition-colors duration-300">Investment Guide</a></li>
              <li><a href="#" className="text-gray-400 hover:text-orange transition-colors duration-300">Market Analysis</a></li>
              <li><a href="#" className="text-gray-400 hover:text-orange transition-colors duration-300">Risk Management</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-orange transition-colors duration-300">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-orange transition-colors duration-300">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-orange transition-colors duration-300">API Docs</a></li>
              <li><a href="#" className="text-gray-400 hover:text-orange transition-colors duration-300">System Status</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-orange transition-colors duration-300">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-orange transition-colors duration-300">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-orange transition-colors duration-300">Press</a></li>
              <li><a href="#" className="text-gray-400 hover:text-orange transition-colors duration-300">Partners</a></li>
            </ul>
          </div>
        </div>
        <div className="glass-card p-6 mb-8 rounded-xl">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Stay Updated</h3>
              <p className="text-gray-400">Get the latest crypto insights and platform updates.</p>
            </div>
            <div className="flex space-x-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-dark-blue border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-orange min-w-64"
              />
              <button className="bg-orange text-white px-6 py-3 rounded-lg font-semibold whitespace-nowrap hover:bg-orange-dark">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>&copy; 2024 NexGen. All rights reserved.</span>
              <a href="#" className="hover:text-orange transition-colors flex items-center space-x-1">
                <FileText className="w-4 h-4" />
                <span>Privacy Policy</span>
              </a>
              <a href="#" className="hover:text-orange transition-colors">Terms of Service</a>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-dark-blue/20 rounded-full flex items-center justify-center hover:bg-orange/30 transition-colors"
              >
                <Youtube className="w-5 h-5 text-orange" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
