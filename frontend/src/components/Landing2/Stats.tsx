import { useEffect, useState } from 'react';
import { DollarSign, Users, BarChart, Shield } from 'lucide-react';

const Stats = () => {
  const [counters, setCounters] = useState({
    users: 0,
    volume: 0,
    countries: 0,
    growth: 0
  });

  const finalValues = {
    users: 2100000,
    volume: 2500000000,
    countries: 150,
    growth: 24.5
  };

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;

      setCounters({
        users: Math.floor(finalValues.users * progress),
        volume: Math.floor(finalValues.volume * progress),
        countries: Math.floor(finalValues.countries * progress),
        growth: Math.min(finalValues.growth, finalValues.growth * progress)
      });

      if (step >= steps) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      icon: Users,
      value: counters.users.toLocaleString(),
      suffix: '+',
      label: 'Active Investors',
      color: 'Emerald Green'
    },
    {
      icon: DollarSign,
      value: `$${(counters.volume / 1000000000).toFixed(1)}B`,
      suffix: '+',
      label: 'Assets Under Management',
      color: 'orange'
    },
    {
      icon: BarChart,
      value: counters.countries.toString(),
      suffix: '+',
      label: 'Countries',
      color: 'dark-blue'
    },
    {
      icon: Shield,
      value: counters.growth.toFixed(1),
      suffix: '%',
      label: 'Avg Annual Growth',
      color: 'orange'
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-inter mb-6 text-white">
            Trusted by <span className="bg-[#3B82F6] bg-clip-text text-transparent">Millions</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join the fastest-growing crypto investment platform with proven results
            and industry-leading security standards.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center group"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="glass-card p-8 hover:scale-105 transition-all duration-300 rounded-xl">
                <div className={`w-16 h-16 ${stat.color === 'orange' ? 'bg-orange/20' : 'bg-dark-blue/20'} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse-glow`}>
                  <stat.icon className={`w-8 h-8 ${stat.color === 'orange' ? 'text-orange' : 'text-dark-blue'}`} />
                </div>

                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.value}{stat.suffix}
                </div>

                <div className="text-gray-400 text-lg">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
