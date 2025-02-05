import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Adjust the import paths as necessary

interface InvestmentPlanCardProps {
  plan: {
    id: number;
    plan: String,
    minimumAmount: number;
    maximumAmount: number;
    interestRate: number;
    totalReturns: number;
    recommended: boolean
  };
  onSubscribe: (planId: number) => void;
}

const InvestmentPlanCard: React.FC<InvestmentPlanCardProps> = ({ plan, onSubscribe }) => {
  return (
    <Card
      className={`relative ${plan.recommended
        ? 'border-orange-400 shadow-lg bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10'
        : 'bg-slate-200 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10'
        }`}
    >
      {/* {plan.recommended && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-montserrat font-bold">
            Recommended
          </span>
        </div>
      )} */}

      <CardHeader>
        <h3 className="text-2xl font-bold text-center text-coral-black capitalize">{plan.plan}</h3>
      </CardHeader>

      <CardContent>
        <div className="text-center mb-6 text-coral-black">
          <span className="text-4xl font-bold text-orange-500">{plan.interestRate}%</span>
          <span className="block">daily interest</span>
        </div>

        <ul className="space-y-3 text-coral-black">
          <li className="flex items-center space-x-3">
            <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
            <span>Minimum Amount: ${plan.minimumAmount}</span>
          </li>
          <li className="flex items-center space-x-3">
            <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
            <span>Maximum Amount: ${plan.maximumAmount}</span>
          </li>
          <li className="flex items-center space-x-3">
            <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
            <span>Total Returns: {plan.totalReturns}%</span>
          </li>
        </ul>
      </CardContent>

      <CardFooter>
        <Button onClick={() => onSubscribe(plan.id)} className="bg-slate-100 text-blue-800 font-bold py-2 px-4 rounded-full hover:bg-gray-200">Subscribe</Button>
      </CardFooter>
    </Card>
  );
};

export default InvestmentPlanCard;