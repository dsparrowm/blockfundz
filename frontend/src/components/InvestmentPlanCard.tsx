import React from 'react';
import { Check, Star, TrendingUp, DollarSign, Target, Zap } from 'lucide-react';

interface InvestmentPlanCardProps {
  plan: {
    id: number;
    plan: string;
    minimumAmount: number;
    maximumAmount: number;
    interestRate: number;
    totalReturns: number;
    recommended?: boolean;
  };
  isSubscribed?: boolean;
  onSubscribe: (planId: number) => void;
}

const InvestmentPlanCard: React.FC<InvestmentPlanCardProps> = ({ plan, isSubscribed = false, onSubscribe }) => {
  // Color themes for different plans
  const getCardTheme = (planName: string) => {
    const name = planName.toLowerCase();
    if (name.includes('basic') || name.includes('starter')) {
      return {
        gradient: 'from-blue-500 to-blue-600',
        accent: 'blue-500',
        bg: 'bg-blue-50',
        icon: DollarSign,
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600'
      };
    } else if (name.includes('premium') || name.includes('pro')) {
      return {
        gradient: 'from-purple-500 to-purple-600',
        accent: 'purple-500',
        bg: 'bg-purple-50',
        icon: Star,
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600'
      };
    } else if (name.includes('enterprise') || name.includes('ultimate')) {
      return {
        gradient: 'from-yellow-500 to-yellow-600',
        accent: 'yellow-500',
        bg: 'bg-yellow-50',
        icon: Target,
        iconBg: 'bg-yellow-100',
        iconColor: 'text-yellow-600'
      };
    } else {
      return {
        gradient: 'from-green-500 to-green-600',
        accent: 'green-500',
        bg: 'bg-green-50',
        icon: TrendingUp,
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600'
      };
    }
  };

  const theme = getCardTheme(plan.plan);
  const IconComponent = theme.icon;

  return (
    <div className={`relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-lg dark:hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden ${plan.recommended ? 'ring-2 ring-yellow-400 dark:ring-yellow-500' : ''}`}>
      {/* Recommended Badge */}
      {plan.recommended && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 dark:from-yellow-500 dark:to-yellow-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center space-x-1 shadow-lg">
            <Star className="w-3 h-3" />
            <span>Recommended</span>
          </div>
        </div>
      )}

      {/* Header with gradient */}
      <div className={`bg-gradient-to-r ${theme.gradient} dark:from-[#4a154b] dark:to-[#1a1d29] p-6 text-white relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full transform translate-x-8 -translate-y-8"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full transform -translate-x-6 translate-y-6"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className={`w-12 h-12 ${theme.iconBg} dark:bg-[#3c3f4c] rounded-lg flex items-center justify-center`}>
              <IconComponent className={`w-6 h-6 ${theme.iconColor} dark:text-white`} />
            </div>
            {plan.recommended && (
              <Zap className="w-5 h-5 text-yellow-300 dark:text-yellow-400" />
            )}
          </div>

          <h3 className="text-2xl font-bold capitalize mb-1">{plan.plan}</h3>
          <p className="text-white/80 text-sm">Investment Plan</p>
        </div>
      </div>

      {/* Interest Rate Highlight */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-600">
        <div className="text-center">
          <div className="flex items-baseline justify-center space-x-1">
            <span className={`text-4xl font-bold text-${theme.accent} dark:text-white`}>{plan.interestRate}%</span>
            <span className="text-lg text-gray-600 dark:text-gray-400 font-medium">APY</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Annual Percentage Yield</p>
        </div>
      </div>

      {/* Plan Details */}
      <div className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#1a1d29] rounded-lg">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Minimum Investment</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">${plan.minimumAmount.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#1a1d29] rounded-lg">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Maximum Investment</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">${plan.maximumAmount.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#1a1d29] rounded-lg">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Returns</span>
            <span className="text-sm font-bold text-green-600 dark:text-green-400">{plan.totalReturns}%</span>
          </div>
        </div>

        {/* Features List */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Daily interest calculation</span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Automatic profit distribution</span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Flexible withdrawal options</span>
          </div>
        </div>

        {/* Subscribe Button */}
        <button
          onClick={() => !isSubscribed && onSubscribe(plan.id)}
          disabled={isSubscribed}
          className={`w-full mt-6 ${isSubscribed
            ? 'bg-gray-100 dark:bg-[#3c3f4c] text-gray-500 dark:text-gray-400 cursor-not-allowed border-2 border-gray-200 dark:border-[#4a4e5c]'
            : `bg-gradient-to-r ${theme.gradient} dark:from-[#4a154b] dark:to-[#1a1d29] hover:shadow-lg text-white transform hover:scale-105 shadow-md hover:shadow-xl`
            } font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${theme.accent} dark:focus:ring-[#4a154b]`}
        >
          {isSubscribed ? (
            <>
              <Check className="w-4 h-4" />
              <span>Subscribed</span>
            </>
          ) : (
            <>
              <TrendingUp className="w-4 h-4" />
              <span>Subscribe Now</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InvestmentPlanCard;