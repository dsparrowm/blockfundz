import { Youtube, Shield, FileText } from 'lucide-react';
import NexGenLogo from "../ui/NexGenLogo"

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <NexGenLogo variant="full" size="md" />
            </div>
            <p className="text-gray-600 mb-6 max-w-sm leading-relaxed">
              The future of crypto investment. Join millions of users building wealth with
              advanced AI-powered strategies and bank-level security.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-green-600 text-sm">
                <Shield className="w-4 h-4" />
                <span>Regulated & Secure</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold mb-4">PRODUCT</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors duration-200">Features</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors duration-200">Integrations</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors duration-200">Enterprise</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors duration-200">Solutions</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold mb-4">COMPANY</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors duration-200">About us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors duration-200">Leadership</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors duration-200">News</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors duration-200">Media kit</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold mb-4">RESOURCES</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors duration-200">Download</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors duration-200">Help center</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors duration-200">Guides</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors duration-200">Events</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold mb-4">EXTRAS</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors duration-200">Podcast</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors duration-200">NexGen shop</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors duration-200">NexGen at Work</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors duration-200">Fund</a></li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="bg-white p-8 mb-8 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Stay in the loop</h3>
              <p className="text-gray-600">Subscribe to get the latest updates, market insights, and platform news.</p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <input
                type="email"
                placeholder="name@company.com"
                className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 min-w-64"
              />
              <button className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold whitespace-nowrap hover:bg-purple-700 transition-all duration-200 hover:-translate-y-0.5">
                SUBSCRIBE
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <span>&copy; 2025 NexGen Technologies, Inc. All rights reserved.</span>
              <a href="#" className="hover:text-purple-600 transition-colors flex items-center space-x-1">
                <FileText className="w-4 h-4" />
                <span>Privacy & Terms</span>
              </a>
              <a href="#" className="hover:text-purple-600 transition-colors">Contact us</a>
            </div>
            <div className="flex items-center space-x-4">
              <p className="text-sm text-gray-500">Follow us</p>
              <a
                href="#"
                className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-purple-100 hover:text-purple-600 transition-all duration-200 border border-gray-200"
              >
                <Youtube className="w-5 h-5 text-gray-500" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
