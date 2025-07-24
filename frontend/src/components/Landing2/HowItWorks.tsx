import { User, Target, Wallet, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

const HowItWorks = () => {
  const [currentStep, setCurrentStep] = useState(-1);
  const [showBackground, setShowBackground] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const howItWorksSteps = [
    {
      step: 1,
      title: 'Create Your Account',
      description: 'Sign up in minutes with just your email and complete our simple verification process.',
      icon: User,
      gradient: 'from-violet-500 via-purple-500 to-violet-600',
      bgColor: 'bg-violet-50',
      borderColor: 'border-violet-200'
    },
    {
      step: 2,
      title: 'Choose Your Plan',
      description: 'Select an investment plan that matches your risk tolerance and financial goals.',
      icon: Target,
      gradient: 'from-blue-500 via-cyan-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      step: 3,
      title: 'Fund Your Portfolio',
      description: 'Securely deposit funds using bank transfer, card, or cryptocurrency.',
      icon: Wallet,
      gradient: 'from-emerald-500 via-green-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    },
    {
      step: 4,
      title: 'Watch It Grow',
      description: 'Our AI algorithms automatically manage and optimize your portfolio for maximum returns.',
      icon: TrendingUp,
      gradient: 'from-amber-500 via-orange-500 to-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    }
  ];

  useEffect(() => {
    const sequence = async () => {
      // Show background first
      setTimeout(() => setShowBackground(true), 300);

      // Show steps sequentially
      for (let i = 0; i < howItWorksSteps.length; i++) {
        setTimeout(() => {
          setCurrentStep(i);
        }, 1000 + i * 2500);

        // Mark step as completed after showing
        setTimeout(() => {
          setCompletedSteps(prev => [...prev, i]);
        }, 1000 + i * 2500 + 2000);
      }

      // Reset after showing all
      setTimeout(() => {
        setCurrentStep(-1);
        setCompletedSteps([]);
        setShowBackground(false);
      }, 1000 + howItWorksSteps.length * 2500 + 3000);
    };

    sequence();
    const interval = setInterval(sequence, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
      {/* Animated Background */}
      <div className={`absolute inset-0 transition-all duration-2000 ${showBackground ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-100/40 to-blue-100/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-blue-100/40 to-green-100/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
            How NexGen{' '}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              transforms wealth
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Start your crypto investment journey in just four simple steps.
            Our platform makes it easy to begin building personal wealth.
          </p>
        </div>

        {/* Interactive Steps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {howItWorksSteps.map((step, index) => (
            <div key={step.step} className="relative">
              {/* Step Card */}
              <div className={`relative p-8 rounded-3xl border-2 transition-all duration-1000 transform ${currentStep === index
                  ? `${step.bgColor} ${step.borderColor} scale-105 shadow-2xl opacity-100 translate-y-0`
                  : completedSteps.includes(index)
                    ? `bg-white border-gray-200 opacity-80 translate-y-0`
                    : 'bg-gray-50 border-gray-100 opacity-40 translate-y-4'
                }`}>

                {/* Animated Border Glow */}
                {currentStep === index && (
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${step.gradient} opacity-20 animate-pulse`}></div>
                )}

                {/* Floating Elements */}
                {currentStep === index && (
                  <>
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-ping"></div>
                    <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-gradient-to-r from-blue-400 to-green-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                  </>
                )}

                <div className="relative z-10">
                  {/* Step Icon */}
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-700 ${currentStep === index
                      ? `bg-gradient-to-br ${step.gradient} shadow-xl scale-110 rotate-12`
                      : completedSteps.includes(index)
                        ? `bg-gradient-to-br ${step.gradient} shadow-lg`
                        : 'bg-gray-200'
                    }`}>
                    <step.icon className={`w-8 h-8 transition-all duration-500 ${currentStep === index || completedSteps.includes(index) ? 'text-white' : 'text-gray-400'
                      } ${currentStep === index ? 'animate-bounce' : ''}`} />
                  </div>

                  {/* Step Number Badge */}
                  <div className={`absolute top-14 left-14 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${currentStep === index
                      ? 'bg-white text-purple-600 shadow-lg scale-110'
                      : completedSteps.includes(index)
                        ? 'bg-white text-green-600 shadow-md'
                        : 'bg-gray-300 text-gray-500'
                    }`}>
                    {completedSteps.includes(index) ? '✓' : step.step}
                  </div>

                  {/* Content */}
                  <h3 className={`text-2xl font-bold mb-4 transition-all duration-500 ${currentStep === index ? 'text-gray-900' : 'text-gray-600'
                    }`}>
                    {step.title}
                  </h3>

                  <p className={`text-lg leading-relaxed transition-all duration-500 ${currentStep === index ? 'text-gray-700' : 'text-gray-500'
                    }`}>
                    {step.description}
                  </p>

                  {/* Progress Indicator */}
                  {currentStep === index && (
                    <div className="mt-6">
                      <div className="flex items-center space-x-2 text-purple-600">
                        <Sparkles className="w-4 h-4 animate-spin" />
                        <span className="text-sm font-medium animate-pulse">Processing step {step.step}...</span>
                      </div>
                      <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Connection Arrow (for larger screens) */}
              {index % 2 === 0 && index < howItWorksSteps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className={`w-8 h-8 transition-all duration-1000 ${completedSteps.includes(index) ? 'text-purple-500 animate-pulse' : 'text-gray-300'
                    }`} />
                </div>
              )}

              {/* Connection Arrow (reverse for right column) */}
              {index % 2 === 1 && index < howItWorksSteps.length - 1 && (
                <div className="hidden lg:block absolute bottom-0 left-1/2 transform translate-y-4 -translate-x-1/2 rotate-90">
                  <ArrowRight className={`w-8 h-8 transition-all duration-1000 ${completedSteps.includes(index) ? 'text-purple-500 animate-pulse' : 'text-gray-300'
                    }`} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Completion Message */}
        {completedSteps.length === howItWorksSteps.length && (
          <div className="text-center mt-16 animate-bounce-in">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 p-8 rounded-2xl max-w-2xl mx-auto">
              <div className="text-5xl mb-4 animate-bounce">🚀</div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Wealth Transformation Complete!</h3>
              <p className="text-lg text-gray-600 mb-6">
                You're now ready to start building generational wealth with NexGen's intelligent platform.
              </p>
              <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-10 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                Start Your Journey Today
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HowItWorks;
