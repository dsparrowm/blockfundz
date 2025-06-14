
import { User, Target, Wallet, TrendingUp } from 'lucide-react';

const HowItWorks = () => {
  const howItWorksSteps = [
    {
      step: 1,
      title: 'Create Your Account',
      description: 'Sign up in minutes with just your email and complete our simple verification process.',
      icon: User
    },
    {
      step: 2,
      title: 'Choose Your Plan',
      description: 'Select an investment plan that matches your risk tolerance and financial goals.',
      icon: Target
    },
    {
      step: 3,
      title: 'Fund Your Portfolio',
      description: 'Securely deposit funds using bank transfer, card, or cryptocurrency.',
      icon: Wallet
    },
    {
      step: 4,
      title: 'Watch It Grow',
      description: 'Our AI algorithms automatically manage and optimize your portfolio for maximum returns.',
      icon: TrendingUp
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-crypto-dark-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Start your crypto investment journey in just four simple steps.
            Our platform makes it easy to begin building wealth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {howItWorksSteps.map((step, index) => (
            <div key={step.step} className="text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-crypto-gradient rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-crypto-blue/20 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{step.step}</span>
                </div>
                {index < howItWorksSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-crypto-blue to-transparent"></div>
                )}
              </div>

              <h3 className="text-xl font-semibold mb-4 text-white">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
