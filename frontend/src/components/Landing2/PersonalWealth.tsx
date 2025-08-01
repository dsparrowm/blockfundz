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
        <section id="personal-wealth" className="py-24 bg-gradient-to-br from-purple-900/20 to-blue-900/20 bg-gray-900">
            <div className="container mx-auto px-6">
                <div className="text-center mb-20">
                    <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gray-100">
                        Your{' '}
                        <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            personal wealth
                        </span>{' '}
                        journey
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Build, grow, and protect your personal wealth with cutting-edge technology
                        designed specifically for individual investors like you.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {wealthBenefits.map((benefit, index) => (
                        <div
                            key={benefit.title}
                            className="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-purple-500 hover:shadow-xl transition-all duration-300 group text-center animate-fade-in"
                            style={{ animationDelay: `${index * 0.2}s` }}
                        >
                            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-900/50 to-blue-900/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <benefit.icon className="w-8 h-8 text-purple-400" />
                            </div>

                            <div className="mb-4">
                                <h3 className="text-xl font-bold text-gray-100 mb-2">{benefit.title}</h3>
                                <div className="text-2xl font-bold text-purple-400 mb-3">{benefit.stat}</div>
                            </div>

                            <p className="text-gray-300 text-sm leading-relaxed">{benefit.description}</p>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-16">
                    <div className="bg-gray-800 p-8 rounded-2xl border border-purple-500 shadow-lg max-w-4xl mx-auto">
                        <h3 className="text-2xl font-bold text-gray-100 mb-4">
                            Ready to start building your personal wealth?
                        </h3>
                        <p className="text-gray-300 mb-6">
                            Join thousands of individual investors who have already started their journey to financial freedom.
                        </p>
                        <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
                            Start Your Journey Today
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PersonalWealth;
