
import { Wallet, TrendingUp, Shield, Settings, BarChart, Users } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Wallet,
      title: 'Smart Portfolio Growth',
      description: 'Automated portfolio management with AI-driven rebalancing to maximize your returns.',
      color: 'crypto-blue'
    },
    {
      icon: TrendingUp,
      title: 'Passive Income Generation',
      description: 'Earn consistent returns through our diversified investment strategies and staking rewards.',
      color: 'crypto-green'
    },
    {
      icon: Shield,
      title: 'Secure Asset Protection',
      description: 'Your investments are protected with military-grade encryption and insured cold storage.',
      color: 'crypto-gold'
    },
    {
      icon: BarChart,
      title: 'Performance Analytics',
      description: 'Track your investment growth with detailed analytics and performance insights.',
      color: 'crypto-blue'
    },
    {
      icon: Settings,
      title: 'Custom Investment Plans',
      description: 'Personalized investment strategies based on your risk tolerance and goals.',
      color: 'crypto-green'
    },
    {
      icon: Users,
      title: 'Expert Management',
      description: 'Professional fund managers optimize your portfolio for consistent long-term growth.',
      color: 'crypto-gold'
    }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-b from-crypto-dark to-crypto-dark-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Everything You Need to{' '}
            <span className="text-gradient">Grow Your Wealth</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Professional investment tools and strategies designed to help you build
            long-term wealth through smart cryptocurrency investments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-card p-8 hover:scale-105 transition-all duration-300 group hover:shadow-xl hover:shadow-crypto-blue/10"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-16 h-16 bg-${feature.color}/20 rounded-xl flex items-center justify-center mb-6 group-hover:animate-pulse-glow`}>
                <feature.icon className={`w-8 h-8 text-${feature.color}`} />
              </div>

              <h3 className="text-xl font-semibold mb-4 text-white group-hover:text-crypto-blue transition-colors">
                {feature.title}
              </h3>

              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
