import { Wallet, TrendingUp, Shield, Settings, BarChart, Users } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Wallet,
      title: 'Smart Portfolio Growth',
      description: 'Automated portfolio management with AI-driven rebalancing to maximize your returns while you focus on what matters most.',
      color: 'purple'
    },
    {
      icon: TrendingUp,
      title: 'Real-time Analytics',
      description: 'Track your investment performance with instant insights, detailed charts, and comprehensive portfolio analytics.',
      color: 'blue'
    },
    {
      icon: Shield,
      title: 'Bank-level Security',
      description: 'Your investments are protected with enterprise-grade security, multi-factor authentication, and insured cold storage.',
      color: 'green'
    },
    {
      icon: BarChart,
      title: 'AI-Powered Strategies',
      description: 'Machine learning algorithms analyze market trends to optimize your investment strategy automatically.',
      color: 'indigo'
    },
    {
      icon: Settings,
      title: 'Custom Investment Plans',
      description: 'Personalized investment strategies tailored to your risk profile, timeline, and financial goals.',
      color: 'orange'
    },
    {
      icon: Users,
      title: '24/7 Expert Support',
      description: 'Access to certified financial advisors and investment specialists whenever you need guidance.',
      color: 'teal'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-900/50 text-blue-400',
      green: 'bg-green-900/50 text-green-400',
      purple: 'bg-purple-900/50 text-purple-400',
      indigo: 'bg-indigo-900/50 text-indigo-400',
      orange: 'bg-orange-900/50 text-orange-400',
      teal: 'bg-teal-900/50 text-teal-400'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-blue-900/50 text-blue-400';
  };

  return (
    <section id="features" className="py-20 sm:py-24 bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-gray-100">
            Move faster with{' '}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              powerful features
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Everything you need to build personal wealth. From AI-powered strategies
            to real-time analytics, we've got you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-purple-500 hover:shadow-2xl transition-all duration-300 group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-12 h-12 ${getColorClasses(feature.color)} rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold mb-4 text-gray-100 group-hover:text-purple-400 transition-colors">
                {feature.title}
              </h3>

              <p className="text-gray-300 leading-relaxed">
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
