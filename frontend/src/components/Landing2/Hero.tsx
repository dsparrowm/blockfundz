import { Button } from '@/components/ui/button';
import { TrendingUp, Shield, Users } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 sm:pt-0">
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold font-inter mb-6 animate-slide-up">
            Grow Your Wealth with{' '}
            <span className="bg-gradient-to-r from-[#1E3A8A] to-orange-500 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">Smart Crypto Investing</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-slide-up animation-delay-200">
            Join 2.1M+ investors who trust our platform to grow their funds with
            AI-powered investment strategies and bank-level security.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-up animation-delay-400">
            <a href="/register">
              <Button className="bg-orange-500 text-white px-8 py-4 text-lg font-semibold rounded-lg hover:bg-orange-dark hover:scale-105 transition-transform duration-300">
                Start Investing Now
              </Button>
            </a>
            <a href="#how-it-works">
              <Button variant="outline" className="border-gray-400 text-white bg-transparent hover:bg-dark-blue/10 px-8 hover:text-white py-4 text-lg font-semibold rounded-lg">
                See How It Works
              </Button>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-up animation-delay-600">
            <div className="flex items-center justify-center space-x-3">
              <div className="glass-card w-12 h-12 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-[#0077b6]" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-white">2,100,000+</div>
                <div className="text-gray-400">Active Investors</div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-3">
              <div className="glass-card w-12 h-12 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#0077b6]" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-white">24.5%</div>
                <div className="text-gray-400">Avg Annual Growth</div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-3">
              <div className="glass-card w-12 h-12 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-[#0077b6]" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-white">$2.5B+</div>
                <div className="text-gray-400">Assets Secured</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-dark-blue rounded-full flex justify-center">
          <div className="w-1 h-3 bg-[#0077b6] rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
