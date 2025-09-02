import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  const navigate = useNavigate();

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      description: 'Perfect for individuals starting their investment journey',
      features: [
        'Up to $10,000 investment portfolio',
        'Basic portfolio tracking & analytics',
        'Standard support',
        'Core investment tools',
        'Mobile & desktop access'
      ],
      popular: false,
      buttonText: 'TRY FOR FREE',
      note: 'Free forever'
    },
    {
      name: 'Pro',
      price: '$7.25',
      period: '/month',
      description: 'Best for serious investors who want more flexibility',
      features: [
        'Everything in Free, plus:',
        'Unlimited investment portfolios',
        'Advanced AI-powered strategies',
        'Priority support & training',
        'Advanced analytics & reporting',
        'Custom investment plans',
        'Tax optimization tools'
      ],
      popular: true,
      buttonText: 'TRY FOR FREE',
      note: 'Billed annually'
    },
    {
      name: 'Business+',
      price: '$12.50',
      period: '/month',
      description: 'Best for high-net-worth individuals who need advanced features',
      features: [
        'Everything in Pro, plus:',
        'Dedicated account manager',
        'Enterprise-grade security',
        'Advanced compliance tools',
        'Custom integrations',
        'White-label solutions',
        'SLA & uptime guarantee'
      ],
      popular: false,
      buttonText: 'CONTACT SALES',
      note: 'Billed annually'
    }
  ];

  return (
    <section id="pricing" className="py-20 sm:py-24 bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-gray-100">
            Choose a plan that{' '}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              works for you
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Upgrade at any time. For high-net-worth individuals with additional security, compliance,
            and support requirements, contact our sales team.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.name}
              className={`bg-gray-800 border-2 hover:shadow-2xl transition-all duration-300 relative group ${plan.popular
                ? 'border-purple-500 shadow-lg scale-105'
                : 'border-gray-700 hover:border-purple-500'
                }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                    MOST POPULAR
                  </div>
                </div>
              )}

              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-gray-100 text-2xl mb-4 font-bold">{plan.name}</CardTitle>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-100">{plan.price}</span>
                  <span className="text-gray-400 text-lg ml-2">{plan.period}</span>
                </div>
                <p className="text-gray-300 leading-relaxed">{plan.description}</p>
                <p className="text-sm text-gray-400 mt-2">{plan.note}</p>
              </CardHeader>

              <CardContent className="px-6 pb-8">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full font-semibold py-4 text-sm transition-all duration-200 ${plan.popular
                    ? 'bg-purple-600 text-white hover:bg-purple-700 hover:-translate-y-0.5 shadow-lg'
                    : 'bg-gray-800 text-purple-400 border-2 border-purple-500 hover:bg-purple-900/20'
                    }`}
                  onClick={() => navigate("/signup")}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Banner */}
        <div className="text-center mt-20">
          <p className="text-lg text-gray-300 mb-8">
            Still have questions? <span className="text-purple-400 font-semibold cursor-pointer hover:underline">Get in touch</span>
          </p>
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-100 mb-4">
              Looking for our Enterprise Grid?
            </h3>
            <p className="text-gray-300 mb-6">
              NexGen Enterprise Grid is a version of NexGen built for very large organizations.
            </p>
            <Button className="bg-purple-600 text-white hover:bg-purple-700 px-8 py-3 font-semibold">
              LEARN MORE
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
