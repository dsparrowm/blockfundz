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
    <section id="team" className="py-20 bg-crypto-card-dark/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Meet Our <span className="text-gradient">Expert Team</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Our leadership team combines decades of experience in finance, technology,
            and cryptocurrency to deliver exceptional results for our investors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div key={member.name} className="glass-card p-6 text-center hover:scale-105 transition-all duration-300 group">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-crypto-blue/20 group-hover:ring-crypto-blue/40 transition-all">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="text-xl font-semibold text-white mb-2">{member.name}</h3>
              <p className="text-crypto-blue font-medium mb-4">{member.role}</p>
              <p className="text-gray-400 text-sm">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
