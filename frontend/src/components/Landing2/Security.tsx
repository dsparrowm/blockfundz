
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
    <section id="security" className="py-20 bg-gradient-to-b from-crypto-dark-secondary to-crypto-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-crypto-gold/20 text-crypto-gold px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Shield className="w-4 h-4" />
            <span>Enterprise Security</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Your Assets Are{' '}
            <span className="text-gradient">100% Secure</span>
          </h2>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We employ the highest security standards in the industry to protect your investments.
            Your peace of mind is our top priority.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {securityFeatures.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-card p-8 hover:scale-[1.02] transition-all duration-300 group"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-crypto-gold/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:animate-pulse-glow">
                  <feature.icon className="w-6 h-6 text-crypto-gold" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                    <span className="bg-crypto-green/20 text-crypto-green px-2 py-1 rounded text-xs font-semibold">
                      {feature.badge}
                    </span>
                  </div>

                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Security Stats */}
        <div className="glass-card p-8 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold text-crypto-green mb-2">$2.5B+</div>
              <div className="text-gray-400">Assets Protected</div>
            </div>

            <div>
              <div className="text-3xl font-bold text-crypto-blue mb-2">0</div>
              <div className="text-gray-400">Security Breaches</div>
            </div>

            <div>
              <div className="text-3xl font-bold text-crypto-gold mb-2">24/7</div>
              <div className="text-gray-400">Security Monitoring</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Security;
