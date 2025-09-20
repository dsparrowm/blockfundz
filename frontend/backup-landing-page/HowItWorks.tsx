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
      bgColor: 'bg-violet-900/20',
      borderColor: 'border-violet-500'
    },
    {
      step: 2,
      title: 'Choose Your Plan',
      description: 'Select an investment plan that matches your risk tolerance and financial goals.',
      icon: Target,
      gradient: 'from-blue-500 via-cyan-500 to-blue-600',
      bgColor: 'bg-blue-900/20',
      borderColor: 'border-blue-500'
    },
    {
      step: 3,
      title: 'Fund Your Portfolio',
      description: 'Securely deposit funds using bank transfer, card, or cryptocurrency.',
      icon: Wallet,
      gradient: 'from-emerald-500 via-green-500 to-emerald-600',
      bgColor: 'bg-emerald-900/20',
      borderColor: 'border-emerald-500'
    },
    {
      step: 4,
      title: 'Watch It Grow',
      description: 'Our AI algorithms automatically manage and optimize your portfolio for maximum returns.',
      icon: TrendingUp,
      gradient: 'from-amber-500 via-orange-500 to-amber-600',
      bgColor: 'bg-amber-900/20',
      borderColor: 'border-amber-500'
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
    <section id="how-it-works" className="py-20 sm:py-24 bg-white/40 relative overflow-hidden">
      {/* Animated Background (reduced on xs) */}
      <div className={`absolute inset-0 transition-all duration-2000 ${showBackground ? 'opacity-100' : 'opacity-0'}`}>
        <div className="hidden sm:block absolute top-0 left-1/6 w-56 md:w-72 h-56 md:h-72 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="hidden sm:block absolute bottom-0 right-1/6 w-44 md:w-56 h-44 md:h-56 bg-gradient-to-br from-blue-900/20 to-green-900/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Title */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-gray-100">
            {/* How NexGen{' '} */}
            <span className="text-bloodred-dark">
              How NexGen transforms wealth
            </span>
          </h2>
          <p className="text-xl text-blackred max-w-3xl mx-auto leading-relaxed">
            Start your crypto investment journey in just four simple steps.
            Our platform makes it easy to begin building personal wealth.
          </p>
        </div>

        {/* Interactive Steps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-full sm:max-w-6xl mx-auto">
          {howItWorksSteps.map((step, index) => (
            <div key={step.step} className="relative">
              {/* Step Card */}
              <div className={`relative p-6 sm:p-8 rounded-2xl border-2 transition-all duration-1000 transform ${currentStep === index
                ? `${step.bgColor} ${step.borderColor} scale-105 shadow-2xl opacity-100 translate-y-0`
                : completedSteps.includes(index)
                  ? `bg-gray-800 border-gray-600 opacity-80 translate-y-0`
                  : 'bg-gray-800/50 border-gray-700 opacity-40 translate-y-2'
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
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-4 sm:mb-6 transition-all duration-700 ${currentStep === index
                    ? `bg-gradient-to-br ${step.gradient} shadow-xl scale-110 rotate-12`
                    : completedSteps.includes(index)
                      ? `bg-gradient-to-br ${step.gradient} shadow-lg`
                      : 'bg-gray-700'
                    }`}>
                    <step.icon className={`w-8 h-8 transition-all duration-500 ${currentStep === index || completedSteps.includes(index) ? 'text-white' : 'text-gray-400'
                      } ${currentStep === index ? 'animate-bounce' : ''}`} />
                  </div>

                  {/* Step Number Badge */}
                  <div className={`absolute top-12 left-12 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${currentStep === index
                    ? 'bg-white text-purple-600 shadow-lg scale-110'
                    : completedSteps.includes(index)
                      ? 'bg-white text-green-600 shadow-md'
                      : 'bg-gray-600 text-gray-300'
                    }`}>
                    {completedSteps.includes(index) ? '✓' : step.step}
                  </div>

                  {/* Content */}
                  <h3 className={`text-2xl font-bold mb-4 transition-all duration-500 ${currentStep === index ? 'text-gray-100' : 'text-gray-300'
                    }`}>
                    {step.title}
                  </h3>

                  <p className={`text-lg leading-relaxed transition-all duration-500 ${currentStep === index ? 'text-gray-200' : 'text-gray-400'
                    }`}>
                    {step.description}
                  </p>

                  {/* Progress Indicator */}
                  {currentStep === index && (
                    <div className="mt-6">
                      <div className="flex items-center space-x-2 text-purple-400">
                        <Sparkles className="w-4 h-4 animate-spin" />
                        <span className="text-sm font-medium animate-pulse">Processing step {step.step}...</span>
                      </div>
                      <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Connection Arrow (for larger screens) */}
              {index % 2 === 0 && index < howItWorksSteps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2">
                  <ArrowRight className={`w-8 h-8 transition-all duration-1000 ${completedSteps.includes(index) ? 'text-purple-400 animate-pulse' : 'text-gray-600'
                    }`} />
                </div>
              )}

              {/* Connection Arrow (reverse for right column) */}
              {index % 2 === 1 && index < howItWorksSteps.length - 1 && (
                <div className="hidden lg:block absolute bottom-0 left-1/2 transform translate-y-2 -translate-x-1/2 rotate-90">
                  <ArrowRight className={`w-8 h-8 transition-all duration-1000 ${completedSteps.includes(index) ? 'text-purple-400 animate-pulse' : 'text-gray-600'
                    }`} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Completion Message */}
        {completedSteps.length === howItWorksSteps.length && (
          <div className="text-center mt-16 animate-bounce-in">
            <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 border-2 border-green-500 p-8 rounded-2xl max-w-full sm:max-w-2xl mx-auto">
              <div className="text-5xl mb-4 animate-bounce">🚀</div>
              <h3 className="text-3xl font-bold text-gray-100 mb-4">Wealth Transformation Complete!</h3>
              <p className="text-lg text-gray-300 mb-6">
                You're now ready to start building generational wealth with NexGen's intelligent platform.
              </p>
              <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-10 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                Start Your Journey Today
              </button>
            </div>
          </div>
        )}
      </div>
    </section >
  );
};

export default HowItWorks;
