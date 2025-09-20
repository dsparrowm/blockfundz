import { Button } from '../ui/button';
import { TrendingUp, Shield, Check, DollarSign, Target, Bitcoin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Hero = () => {
  const navigate = useNavigate();

  // Animation states for the live dashboard demo
  const [animationStep, setAnimationStep] = useState(0);
  const [portfolioValue, setPortfolioValue] = useState(25000);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [monthlyGrowth, setMonthlyGrowth] = useState(12.4);
  const [activeInvestments, setActiveInvestments] = useState(3);

  // Live dashboard animation sequence
  useEffect(() => {
    const sequence = async () => {
      // Step 1: User hovers over Premium plan (2s)
      setTimeout(() => setAnimationStep(1), 2000);

      // Step 2: User clicks Premium plan (3s)
      setTimeout(() => {
        setSelectedPlan('Premium Plan');
        setAnimationStep(2);
      }, 4000);

      // Step 3: Subscription animation (5s)
      setTimeout(() => {
        setIsSubscribing(true);
        setAnimationStep(3);
      }, 6000);

      // Step 4: Success animation & balance growth (7s)
      setTimeout(() => {
        setIsSubscribing(false);
        setActiveInvestments(4);
        setAnimationStep(4);

        // Animate portfolio growth
        let currentValue = 25000;
        const targetValue = 32500;
        const increment = (targetValue - currentValue) / 30;

        const growthInterval = setInterval(() => {
          currentValue += increment;
          setPortfolioValue(Math.floor(currentValue));
          setMonthlyGrowth(prev => Math.min(prev + 0.3, 18.7));

          if (currentValue >= targetValue) {
            clearInterval(growthInterval);
            setPortfolioValue(32500);
            setMonthlyGrowth(18.7);
          }
        }, 100);
      }, 8000);

      // Step 5: Reset cycle (15s)
      setTimeout(() => {
        setAnimationStep(0);
        setSelectedPlan(null);
        setPortfolioValue(25000);
        setMonthlyGrowth(12.4);
        setActiveInvestments(3);
      }, 15000);
    };

    sequence();
    const interval = setInterval(sequence, 16000); // Repeat every 16 seconds

    return () => clearInterval(interval);
  }, []);

  const investmentPlans = [
    {
      id: 1,
      name: 'Basic Plan',
      rate: '8.5%',
      minAmount: '$1,000',
      color: 'blue',
      isSelected: selectedPlan === 'Basic Plan'
    },
    {
      id: 2,
      name: 'Premium Plan',
      rate: '12.8%',
      minAmount: '$5,000',
      color: 'purple',
      isSelected: selectedPlan === 'Premium Plan',
      recommended: true
    },
    {
      id: 3,
      name: 'Enterprise',
      rate: '15.2%',
      minAmount: '$25,000',
      color: 'green',
      isSelected: selectedPlan === 'Enterprise'
    }
  ];

  return (
    <section className="relative bg-white pt-16 pb-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Company Logos */}
          <div className="mb-12">
            <p className="text-sm text-gray-500 mb-6 uppercase tracking-wide">TRUSTED BY LEADING COMPANIES</p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="text-xl font-bold text-gray-400">Goldman Sachs</div>
              <div className="text-xl font-bold text-gray-400">JPMorgan</div>
              <div className="text-xl font-bold text-gray-400">Coinbase</div>
              <div className="text-xl font-bold text-gray-400">Binance</div>
            </div>
          </div>

          {/* Main Hero Content */}
          <div className="space-y-8 mb-16">
            <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 leading-tight animate-fade-in">
              Grow your wealth with{' '}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                smart crypto investing
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-delay">
              Share it. Invest it. Grow it. Side-by-side with AI-powered portfolio management.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-delay-2">
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              onClick={() => navigate("/signup")}
            >
              TRY FOR FREE
            </Button>

            <Button
              variant="outline"
              className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 px-10 py-4 text-lg font-semibold rounded-xl transition-all duration-300"
            >
              FIND YOUR PLAN
            </Button>
          </div>

          {/* Live Dashboard Demo */}
          <div className="relative max-w-5xl mx-auto animate-slide-up">
            <div className="relative">
              {/* Main Dashboard */}
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-500">
                {/* Browser Bar */}
                <div className="bg-gray-100 px-6 py-4 border-b border-gray-200 flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <div className="ml-4 bg-gray-200 rounded-lg px-4 py-1 text-sm text-gray-600">
                    nexgen.com/dashboard
                  </div>
                </div>

                {/* Dashboard Content */}
                <div className="p-8 space-y-6">
                  {/* Header */}
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Portfolio Overview</h2>
                      <p className="text-gray-600">Welcome back, Alex!</p>
                    </div>
                    <div className="flex space-x-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-purple-600">A</span>
                      </div>
                    </div>
                  </div>

                  {/* Portfolio Stats Cards */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className={`bg-purple-50 p-4 rounded-xl transition-all duration-500 ${animationStep >= 4 ? 'ring-2 ring-purple-300' : ''}`}>
                      <div className={`text-2xl font-bold text-purple-600 transition-all duration-1000 ${animationStep >= 4 ? 'scale-110' : ''}`}>
                        ${portfolioValue.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Total Portfolio</div>
                    </div>
                    <div className={`bg-green-50 p-4 rounded-xl transition-all duration-500 ${animationStep >= 4 ? 'ring-2 ring-green-300' : ''}`}>
                      <div className={`text-2xl font-bold text-green-600 transition-all duration-1000 ${animationStep >= 4 ? 'scale-110' : ''}`}>
                        +{monthlyGrowth.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">This Month</div>
                    </div>
                    <div className={`bg-blue-50 p-4 rounded-xl transition-all duration-300 ${animationStep >= 4 ? 'ring-2 ring-blue-300' : ''}`}>
                      <div className={`text-2xl font-bold text-blue-600 transition-all duration-500 ${animationStep >= 4 ? 'scale-110' : ''}`}>
                        {activeInvestments}
                      </div>
                      <div className="text-sm text-gray-600">Active Investments</div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-yellow-600">$892</div>
                      <div className="text-sm text-gray-600">Today's Profit</div>
                    </div>
                  </div>

                  {/* Investment Plans Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Investment Plans</h3>
                      {animationStep >= 2 && (
                        <div className="flex items-center text-sm text-purple-600 animate-fade-in">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          Plan Selected!
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {investmentPlans.map((plan, index) => (
                        <div
                          key={plan.id}
                          className={`
                            relative p-4 rounded-xl border-2 transition-all duration-500 cursor-pointer
                            ${plan.isSelected
                              ? 'border-purple-400 bg-purple-50 ring-2 ring-purple-200 scale-105'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                            }
                            ${animationStep === 1 && plan.name === 'Premium Plan' ? 'ring-2 ring-purple-200' : ''}
                            ${plan.recommended ? 'relative' : ''}
                          `}
                          style={{
                            animationDelay: `${index * 0.1}s`
                          }}
                        >
                          {plan.recommended && (
                            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                              <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">Recommended</span>
                            </div>
                          )}

                          <div className="text-center space-y-2">
                            <h4 className="font-semibold text-gray-900">{plan.name}</h4>
                            <div className="text-xl font-bold text-purple-600">{plan.rate}</div>
                            <div className="text-xs text-gray-500">APY</div>
                            <div className="text-sm text-gray-600">Min: {plan.minAmount}</div>

                            {plan.isSelected && isSubscribing && (
                              <div className="mt-2">
                                <div className="w-full bg-gray-200 rounded-full h-2 animate-pulse">
                                  <div className="bg-purple-600 h-2 rounded-full animate-loading-bar"></div>
                                </div>
                                <p className="text-xs text-purple-600 mt-1">Subscribing...</p>
                              </div>
                            )}

                            {plan.isSelected && !isSubscribing && animationStep >= 4 && (
                              <div className="mt-2 flex items-center justify-center text-green-600 animate-fade-in">
                                <Check className="w-4 h-4 mr-1" />
                                <span className="text-xs">Subscribed!</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Portfolio Chart Area */}
                  <div className="h-32 bg-gradient-to-r from-purple-100 via-blue-100 to-green-100 rounded-xl flex items-end justify-between p-4 relative overflow-hidden">
                    {/* Animated growth bars */}
                    {[60, 70, 85, 90, 78, 95, 88, 92].map((height, index) => (
                      <div
                        key={index}
                        className={`w-3 bg-gradient-to-t from-purple-400 to-purple-600 rounded-t transition-all duration-1000 ${animationStep >= 4 ? 'animate-bounce' : ''
                          }`}
                        style={{
                          height: `${height}%`,
                          animationDelay: `${index * 0.1}s`
                        }}
                      ></div>
                    ))}

                    {/* Success animation overlay */}
                    {animationStep >= 4 && (
                      <div className="absolute inset-0 bg-green-100/20 rounded-xl animate-pulse"></div>
                    )}
                  </div>

                  {/* Recent Activity */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <DollarSign className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Interest Payment</p>
                            <p className="text-xs text-gray-500">2 hours ago</p>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-green-600">+$156.78</span>
                      </div>

                      {animationStep >= 4 && (
                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg animate-fade-in border border-purple-200">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <Target className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">Subscribed to Premium Plan</p>
                              <p className="text-xs text-gray-500">Just now</p>
                            </div>
                          </div>
                          <span className="text-sm font-bold text-purple-600">12.8% APY</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Success Notification */}
              {animationStep >= 4 && (
                <div className="absolute -top-4 -right-4 bg-green-500 text-white p-4 rounded-xl shadow-lg animate-bounce-in">
                  <div className="flex items-center space-x-2">
                    <Check className="w-5 h-5" />
                    <div>
                      <p className="text-sm font-semibold">Success!</p>
                      <p className="text-xs">Earning 12.8% APY</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Floating Security Badge */}
              <div className="absolute -bottom-4 -left-4 bg-purple-500 text-white p-3 rounded-xl shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                <Shield className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
