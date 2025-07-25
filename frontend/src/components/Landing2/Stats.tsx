import { useEffect, useState, useRef } from 'react';

const Stats = () => {
  const [counters, setCounters] = useState({
    satisfaction: 0,
    messages: 0,
    companies: 0,
    growth: 0
  });
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const finalValues = {
    satisfaction: 90,
    messages: 700,
    companies: 5000,
    growth: 156
  };

  // Easing function for smooth animation
  const easeOutCubic = (t: number): number => {
    return 1 - Math.pow(1 - t, 3);
  };

  const animateCounters = () => {
    if (hasAnimated) return;
    setHasAnimated(true);

    const duration = 2500; // 2.5 seconds
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      setCounters({
        satisfaction: Math.floor(finalValues.satisfaction * easedProgress),
        messages: Math.floor(finalValues.messages * easedProgress),
        companies: Math.floor(finalValues.companies * easedProgress),
        growth: Math.floor(finalValues.growth * easedProgress)
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Ensure final values are exact
        setCounters(finalValues);
      }
    };

    requestAnimationFrame(animate);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            // Small delay for better visual effect
            setTimeout(() => {
              animateCounters();
            }, 300);
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the section is visible
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasAnimated]);

  const stats = [
    {
      value: `${counters.satisfaction}%`,
      label: 'of customers feel more satisfied with work',
      description: 'when they use NexGen to manage their portfolio'
    },
    {
      value: `${counters.messages}M`,
      label: 'daily investment transactions',
      description: 'are processed through our secure platform'
    },
    {
      value: `${counters.companies.toLocaleString()}+`,
      label: 'investment companies',
      description: 'trust NexGen for their portfolio management'
    },
    {
      value: `${counters.growth}%`,
      label: 'increase in portfolio performance',
      description: 'when using AI-powered investment strategies'
    }
  ];

  return (
    <section ref={sectionRef} className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
            Numbers that{' '}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              speak for themselves
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See why industry leaders choose NexGen for their investment strategies and portfolio growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center md:text-left space-y-4 opacity-0 animate-fade-in-up"
              style={{
                animationDelay: `${index * 0.15 + 0.5}s`,
                animationFillMode: 'forwards'
              }}
            >
              <div className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent transition-all duration-200">
                {stat.value}
              </div>

              <div className="space-y-2">
                <h3 className="text-xl md:text-2xl font-semibold text-gray-900">
                  {stat.label}
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {stat.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Trust Indicators */}
        <div className="mt-20 pt-16 border-t border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-8 uppercase tracking-wide opacity-0 animate-fade-in" style={{ animationDelay: '1.5s', animationFillMode: 'forwards' }}>
              FEATURED IN
            </p>
            <div className="flex justify-center items-center space-x-12 opacity-0 animate-fade-in" style={{ animationDelay: '1.8s', animationFillMode: 'forwards' }}>
              <div className="text-2xl font-bold text-gray-400 hover:text-gray-600 transition-colors duration-200">TechCrunch</div>
              <div className="text-2xl font-bold text-gray-400 hover:text-gray-600 transition-colors duration-200">Forbes</div>
              <div className="text-2xl font-bold text-gray-400 hover:text-gray-600 transition-colors duration-200">Bloomberg</div>
              <div className="text-2xl font-bold text-gray-400 hover:text-gray-600 transition-colors duration-200">CNBC</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
