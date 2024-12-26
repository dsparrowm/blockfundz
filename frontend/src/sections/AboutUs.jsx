import { Shield, TrendingUp, Users, Clock, Boxes, Award } from 'lucide-react';
import { features, stats } from '../constants';

const AboutUs = () => {
  return (
      <div className="max-container mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-blue-500 text-gradient">
            Building the Future of Crypto Investment
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            We're pioneering the next generation of crypto wealth management through innovative technology and expert market analysis.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 text-center">
              <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-blue-500 text-gradient">{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
  );
};

export default AboutUs;