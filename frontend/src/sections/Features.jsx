import { features } from '../constants';
import { blogo } from '../assets/images';
import { motion } from 'framer-motion';

const Features = () => {
  const headingVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      rotate: 360,
      transition: {
        duration: 1.2,
        ease: "easeInOut"
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  // Function to get animation variants based on index
  const getFeatureVariants = (index) => {
    // Alternate between different directions based on index
    const directions = [
      { hidden: { y: -100, opacity: 0 }, visible: { y: 0, opacity: 1 } },  // from top
      { hidden: { x: 100, opacity: 0 }, visible: { x: 0, opacity: 1 } },   // from right
      { hidden: { y: 100, opacity: 0 }, visible: { y: 0, opacity: 1 } },   // from bottom
      { hidden: { x: 100, opacity: 0 }, visible: { x: 0, opacity: 1 } },   // from right
    ];

    const selectedVariant = directions[index % directions.length];

    return {
      hidden: selectedVariant.hidden,
      visible: {
        ...selectedVariant.visible,
        transition: {
          duration: 0.7,
          ease: "easeOut"
        }
      },
      hover: {
        scale: 1.02,
        backgroundColor: "rgba(30, 41, 59, 0.7)",
        transition: {
          duration: 0.3,
          ease: "easeInOut"
        }
      }
    };
  };

  return (
    <div className='max-container mx-auto grid grid-cols-2 gap-8'>
      <div className="text-center mb-16">
        <motion.h2
          className="text-4xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-blue-500 text-gradient"
          initial="hidden"
          animate="visible"
          variants={headingVariants}
        >
          Why choose us?
        </motion.h2>
        <motion.img
          src={blogo}
          alt="NexGen Logo"
          className='mx-auto'
          initial="hidden"
          animate="visible"
          whileHover="hover"
          variants={logoVariants}
        />
      </div>

      <motion.div
        className="grid grid-flow-row gap-3 mb-12"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
            variants={getFeatureVariants(index)}
            whileHover="hover"
          >
            <motion.div
              className="mb-4"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              {feature.icon}
            </motion.div>
            <motion.h3
              className="text-xl font-semibold mb-3 text-white-400"
            >
              {feature.title}
            </motion.h3>
            <motion.p
              className="text-gray-400"
            >
              {feature.description}
            </motion.p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default Features