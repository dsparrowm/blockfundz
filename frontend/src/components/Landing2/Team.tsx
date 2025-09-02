import { ceo, cto, connor, sarah } from "../../assets/images";

const Team = () => {
  const teamMembers = [
    {
      name: 'Jeffrey Brown',
      role: 'CEO & Co-Founder',
      image: ceo,
      bio: 'Former Goldman Sachs VP with 15+ years in financial technology and blockchain innovation.'
    },
    {
      name: 'Alex Richmond',
      role: 'CTO & Co-Founder',
      image: cto,
      bio: 'Ex-Google engineer and cryptocurrency pioneer, led development of major DeFi protocols.'
    },
    {
      name: 'Ann Smith',
      role: 'Head of Investments',
      image: sarah,
      bio: 'Portfolio manager with $2B+ AUM, specialized in alternative investments and risk management.'
    },
    {
      name: 'Connor Quinn',
      role: 'Head of Security',
      image: connor,
      bio: 'Cybersecurity expert and former NSA analyst, ensures military-grade protection of user assets.'
    }
  ];

  return (
    <section id="our-team" className="py-16 sm:py-24 bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gray-100">
            Meet the experts helping{' '}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              you build wealth
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Our leadership team combines decades of experience in finance, technology,
            and cryptocurrency to deliver exceptional results for individual investors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={member.name}
              className="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-purple-500 hover:shadow-xl transition-all duration-300 group text-center animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden ring-4 ring-gray-600 group-hover:ring-purple-500 transition-all duration-300">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="text-xl font-bold text-gray-100 mb-2">{member.name}</h3>
              <p className="text-purple-400 font-semibold mb-4">{member.role}</p>
              <p className="text-gray-300 text-sm leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;