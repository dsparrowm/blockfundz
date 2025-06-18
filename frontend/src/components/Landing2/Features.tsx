import { Wallet, TrendingUp, Shield, Settings, BarChart, Users } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Wallet,
      title: 'Smart Portfolio Growth',
      description: 'Automated portfolio management with AI-driven rebalancing to maximize your returns.',
      color: 'cyan'
    },
    {
      icon: TrendingUp,
      title: 'Passive Income Generation',
      description: 'Earn consistent returns through our diversified investment strategies and staking rewards.',
      color: 'cyan'
    },
    {
      icon: Shield,
      title: 'Secure Asset Protection',
      description: 'Your investments are protected with military-grade encryption and insured cold storage.',
      color: 'cyan'
    },
    {
      icon: BarChart,
      title: 'Performance Analytics',
      description: 'Track your investment growth with detailed analytics and performance insights.',
      color: 'cyan'
    },
    {
      icon: Settings,
      title: 'Custom Investment Plans',
      description: 'Personalized investment strategies based on your risk tolerance and goals.',
      color: 'cyan'
    },
    {
      icon: Users,
      title: 'Expert Management',
      description: 'Professional fund managers optimize your portfolio for consistent long-term growth.',
      color: 'cyan'
    }
  ];

  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-inter mb-6 text-white">
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-[#1E3A8A] to-[#06B6D4] bg-clip-text text-transparent">Grow Your Wealth</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-inter font-normal">
            Professional investment tools and strategies designed to help you build
            long-term wealth through smart cryptocurrency investments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-card p-8 hover:scale-105 transition-all duration-300 group rounded-xl"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-16 h-16 bg-[#06B6D4]/20 rounded-xl flex items-center justify-center mb-6 group-hover:animate-pulse-glow`}>
                <feature.icon className="w-8 h-8 text-[#06B6D4]" />
              </div>

              <h3 className="text-xl font-semibold mb-4 text-white">
                {feature.title}
              </h3>

              <p className="text-gray-400 group-hover:text-gray-300 transition-colors font-inter font-normal">
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
