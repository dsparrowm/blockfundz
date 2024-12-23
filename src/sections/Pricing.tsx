import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Check, AlertCircle } from 'lucide-react';
import React from 'react';

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      description: "Perfect for beginners exploring crypto mining",
      price: "0.57%",
      priceDetail: "daily interest",
      features: [
        "Up to $5,000 deposit",
        "Basic mining allocation",
        "Email support",
        "Basic dashboard access",
        "$2500 minimum deposit"
      ],
      recommended: false
    },
    {
      name: "Pro",
      description: "Ideal for serious crypto investors",
      price: "0.67%",
      priceDetail: "daily interest",
      features: [
        "Up to $5,000 deposit",
        "Priority mining allocation",
        "24/7 priority support",
        "Advanced analytics",
        "$3,800 minimum deposit"
      ],
      recommended: true
    },
    {
      name: "Enterprise",
      description: "For institutional investors",
      price: "0.61%",
      priceDetail: "of mining rewards",
      features: [
        "Unlimited deposits",
        "Dedicated mining rigs",
        "Dedicated account manager",
        "Custom analytics",
        "Custom contracts"
      ],
      recommended: false
    }
  ];

  return (
      <div className="max-container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-blue-500 text-gradient">Pricing Plans</h2>
          <p className="text-white-400 max-w-2xl mx-auto">
            Choose the perfect mining plan for your investment goals. 
            All plans include our core security features and insurance coverage.
          </p>
        </div>

        {/* Important Notice */}
        {/* <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-2xl mx-auto">
          <div className="flex items-center space-x-2">
            <AlertCircle className="text-yellow-500 w-5 h-5" />
            <p className="text-sm text-yellow-700">
              Cryptocurrency mining involves risk. Past performance does not guarantee future results. 
              Please read our terms and risk disclosure before investing.
            </p>
          </div>
        </div> */}

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative ${
                plan.recommended 
                  ? 'border-orange-400 shadow-lg bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10' 
                  : 'bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10'
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-montserrat font-bold">
                    Recommended
                  </span>
                </div>
              )}
              
              <CardHeader>
                <h3 className="text-2xl font-bold text-center text-white-400">{plan.name}</h3>
                <p className="text-white-400 text-center mt-2 font-montserrat">{plan.description}</p>
              </CardHeader>
              
              <CardContent>
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-orange-500">{plan.price}</span>
                  <span className="text-gray-300 block">{plan.priceDetail}</span>
                </div>
                
                <ul className="space-y-3">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              {/* <CardFooter>
                <button 
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors
                    ${plan.recommended 
                      ? 'bg-orange-500 text-white hover:bg-orange-600' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                >
                  Get Started
                </button>
              </CardFooter> */}
            </Card>
          ))}
        </div>

        {/* Additional Information */}
        <div className="mt-12 text-center text-white-400">
          <p>All plans include comprehensive security features and insurance coverage.</p>
          <p className="mt-2">
            Need a custom solution? <button className="text-blue-500 hover:underline">Contact us</button>
          </p>
        </div>
      </div>
  );
};

export default Pricing;