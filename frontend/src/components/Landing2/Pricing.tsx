import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const Pricing = () => {
  const pricingPlans = [
    {
      name: 'Starter',
      price: 'beginner',
      description: 'Perfect for beginners getting started with crypto investing',
      features: [
        'Up to $5,000 investment',
        'Basic portfolio tracking',
        'Educational resources',
        'Email support',
        'Mobile app access'
      ],
      popular: false,
      color: 'dark-blue'
    },
    {
      name: 'Growth',
      price: 'Professional',
      period: '',
      description: 'Ideal for serious investors looking to grow their wealth',
      features: [
        'Up to $50,000 investment',
        'Advanced analytics',
        'AI-powered rebalancing',
        'Priority support',
        'Tax optimization tools',
        'Custom alerts'
      ],
      popular: true,
      color: 'orange'
    },
    {
      name: 'Pro',
      price: 'Advanced',
      period: '',
      description: 'For experienced investors who want premium features',
      features: [
        'Up to $500,000 investment',
        'Dedicated account manager',
        'Advanced trading tools',
        'Real-time market data',
        'Custom investment strategies',
        '24/7 phone support',
        'API access'
      ],
      popular: false,
      color: 'dark-blue'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'Tailored solutions for institutions and high-net-worth individuals',
      features: [
        'Unlimited investment capacity',
        'White-label solutions',
        'Custom integrations',
        'Dedicated team',
        'Institutional-grade security',
        'Compliance reporting',
        'SLA guarantees'
      ],
      popular: false,
      color: 'orange'
    }
  ];

  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-inter mb-6 text-white">
            Choose Your <span className="bg-gradient-to-r from-dark-blue to-orange bg-clip-text text-transparent">Investment Plan</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Select the perfect plan for your investment goals. All plans include our core features
            with varying investment limits and premium support options.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pricingPlans.map((plan, index) => (
            <Card key={plan.name} className={`glass-card border-white/10 hover:scale-105 transition-all duration-300 relative ${plan.popular ? 'ring-2 ring-orange' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-orange text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <CardHeader className="text-center">
                <CardTitle className="text-white text-2xl mb-2">{plan.name}</CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  {plan.period && <span className="text-gray-400">{plan.period}</span>}
                </div>
                <p className="text-gray-400">{plan.description}</p>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-3">
                      <CheckCircle className={`w-5 h-5 ${plan.color === 'orange' ? 'text-orange' : 'text-dark-blue'} flex-shrink-0`} />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button className={`w-full ${plan.popular ? 'bg-orange text-white hover:bg-orange-dark' : 'border border-dark-blue text-dark-blue hover:bg-dark-blue/10'} font-semibold`}>
                  {plan.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
