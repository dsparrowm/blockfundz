import { TrendingUp, Shield, Brain, Clock } from 'lucide-react';

const PersonalWealth = () => {
    const wealthBenefits = [
        {
            title: 'Smart AI Strategies',
            description: 'Our AI analyzes market trends 24/7 to optimize your personal investment portfolio for maximum returns.',
            icon: Brain,
            stat: '240% Average ROI'
        },
        {
            title: 'Personal Growth',
            description: 'Build your wealth systematically with personalized investment plans tailored to your financial goals.',
            icon: TrendingUp,
            stat: '$50K+ Average Portfolio'
        },
        {
            title: 'Your Security First',
            description: 'Bank-grade security protects your personal assets with multi-layer encryption and cold storage.',
            icon: Shield,
            stat: '99.9% Uptime'
        },
        {
            title: 'Instant Access',
            description: 'Monitor and manage your personal wealth 24/7 with real-time updates and instant transactions.',
            icon: Clock,
            stat: '<3min Withdrawals'
        }
    ];

    return (
        <section id="personal-wealth" className="py-20 sm:py-24  bg-timberwolf-light">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="text-center mb-12 sm:mb-20">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-gray-100">
                        {/* Your{' '} */}
                        <span className="bg-gradient-to-r from-blackred to-bloodred-dark bg-clip-text text-transparent font-semibold">
                            Your personal wealth journey
                        </span>{' '}
                    </h2>
                    <p className="text-xl text-blackred max-w-3xl mx-auto leading-relaxed">
                        Build, grow, and protect your personal wealth with cutting-edge technology
                        designed specifically for individual investors like you.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {wealthBenefits.map((benefit, index) => (
                        <div
                            key={benefit.title}
                            className="bg-white/100 shadow-2xl  p-8 rounded-2xl border border-white/400 hover:border-purple-500 hover:shadow-xl transition-all duration-300 group text-center animate-fade-in"
                            style={{ animationDelay: `${index * 0.2}s` }}
                        >
                            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-900/50 to-blue-900/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <benefit.icon className="w-8 h-8 text-blackred" />
                            </div>

                            <div className="mb-4">
                                <h3 className="text-xl font-bold text-blackred mb-2">{benefit.title}</h3>
                                <div className="text-2xl font-bold text-bloodred-dark mb-3">{benefit.stat}</div>
                            </div>

                            <p className="text-blackred text-sm leading-relaxed">{benefit.description}</p>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-16">
                    <div className="bg-white/100 shadow-2xl p-8 rounded-2xl border border-white/400 shadow-lg max-w-full sm:max-w-4xl mx-auto">
                        <h3 className="text-2xl font-bold text-bloodred mb-4">
                            Ready to start building your personal wealth?
                        </h3>
                        <p className="text-blackred mb-6">
                            Join thousands of individual investors who have already started their journey to financial freedom.
                        </p>
                        <button className="bg-gradient-to-r from-blackred to-bloodred-dark hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
                            Start Your Journey Today
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PersonalWealth;
