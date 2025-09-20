import { Shield, Lock, Eye, FileText } from 'lucide-react';

const Security = () => {
  const securityFeatures = [
    {
      icon: Shield,
      title: 'Military-Grade Encryption',
      description: 'Your data and assets are protected with AES-256 encryption, the same standard used by banks and government agencies.',
      badge: 'Bank Level'
    },
    {
      icon: Lock,
      title: 'Cold Storage',
      description: '95% of funds stored offline in secure vaults, protected from online threats and hacking attempts.',
      badge: 'Secure Vaults'
    },
    {
      icon: Eye,
      title: 'Multi-Factor Authentication',
      description: 'Advanced security layers including biometric authentication, SMS, and hardware security keys.',
      badge: 'Multi-Layer'
    },
    {
      icon: FileText,
      title: 'Regulatory Compliance',
      description: 'Fully compliant with international financial regulations and audited by leading security firms.',
      badge: 'Regulated'
    }
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
            Security you can{' '}
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              count on
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We use industry-leading security measures to protect your investments
            and personal information with the highest standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {securityFeatures.map((feature, index) => (
            <div
              key={feature.title}
              className="text-center bg-white p-8 rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-xl transition-all duration-300 group animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-8 h-8 text-green-600" />
              </div>

              <div className="inline-flex items-center px-3 py-1 bg-green-50 rounded-full text-green-600 text-xs font-semibold mb-4">
                {feature.badge}
              </div>

              <h3 className="text-xl font-bold mb-4 text-gray-900">
                {feature.title}
              </h3>

              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Security Stats */}
        <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3">
              <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">99.9%</div>
              <div className="text-lg font-semibold text-gray-900">Uptime Guarantee</div>
              <div className="text-gray-600">Always available when you need us</div>
            </div>
            <div className="space-y-3">
              <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">$250M</div>
              <div className="text-lg font-semibold text-gray-900">Insurance Coverage</div>
              <div className="text-gray-600">Your investments are fully protected</div>
            </div>
            <div className="space-y-3">
              <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">0</div>
              <div className="text-lg font-semibold text-gray-900">Security Breaches</div>
              <div className="text-gray-600">Perfect security track record</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Security;
