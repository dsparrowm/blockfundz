import { motion } from "framer-motion";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { ceo, cto, connor, sarah } from "../assets/images";

const teamMembers = [
  {
    name: "Jeffrey Brown",
    role: "CEO",
    image: ceo,
  },
  {
    name: "Alex Richmond",
    role: "Chief Technical Officer",
    image: cto,
  },
  {
    name: "Ann Smith",
    role: "Chief Financial Officer",
    image: sarah,
  },
  {
    name: "Connor Quinn",
    role: "Chief Operations Officer",
    image: connor,
  },
];

// Framer Motion Variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3, // Stagger animations between children
    },
  },
};

const cardVariants = (direction) => ({
  hidden: {
    opacity: 0,
    x: direction === "left" ? -100 : direction === "right" ? 100 : 0,
    y: direction === "up" ? 50 : direction === "down" ? -50 : 0,
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
});

const OurTeam = () => {
  return (
    <section className="min-h-screen bg-black text-white p-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column - Text Content */}
          <div className="space-y-8 mx-auto my-auto">
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-blue-500 text-gradient">
              Meet Our Team
            </h1>
            <p className="text-gray-300 text-lg max-w-md">
              Get to know the passionate and dedicated individuals behind our
              success. Each member of our team brings unique skills, expertise,
              and a shared vision to drive innovation and deliver exceptional
              results. Together, we are committed to empowering our clients and
              creating meaningful impact.
            </p>
            <div>
              <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium">
                LEARN MORE
              </button>
            </div>
          </div>

          {/* Right Column - Team Cards */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {teamMembers.map((member, index) => {
              // Alternate directions for cards
              const direction =
                index % 2 === 0 ? "left" : index % 3 === 0 ? "up" : "right";

              return (
                <motion.div
                  key={member.name}
                  className="flex flex-col flex-1 items-center text-gray-400 bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
                  variants={cardVariants(direction)}
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-15 h-18 object-cover mb-4 border border-gray-500 rounded-lg"
                  />
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-orange-500 mb-4">{member.role}</p>
                  <div className="flex space-x-4">
                    {/* Social Media Icons */}
                    <a href="#" className="text-gray-600 hover:text-black">
                      <FaTwitter />
                    </a>
                    <a href="#" className="text-gray-600 hover:text-black">
                      <FaInstagram />
                    </a>
                    <a href="#" className="text-gray-600 hover:text-black">
                      <FaFacebookF />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OurTeam;