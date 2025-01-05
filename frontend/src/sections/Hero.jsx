import Button from '../components/Button'
import { bitguy } from '../assets/images'
import { arrowRight } from "../assets/icons";
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
  const navigate = useNavigate();

  const textVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      color: "#F97316", // Tailwind's orange-500
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const imageVariants = {
    hidden: {
      opacity: 0,
      x: 100
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1,
        ease: "easeOut",
        delay: 0.5
      }
    },
    hover: {
      scale: 1.05,
      rotate: [0, -2, 2, -2, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section
      id='home'
      className='w-full flex xl:flex-row flex-col justify-center bg-coral-black text-white-400 min-h-screen gap-10 max-container'
    >
      <div className='relative xl:w-2/5 flex flex-1 flex-col justify-center items-start w-full max-xl:padding-x pt-28'>
        <Button 
          label="100% Transparent"
          iconClass="flex justify-center gap-3 items-center px-5 py-3 border-[1.5px] border-[#EEEEEE] rounded-full backdrop-filter backdrop-blur-lg shadow-lg hover:bg-opacity-30 transition-all duration-200 text-white font-semibold outline-1"
        />
        <h1 className='mt-10 font-palanquin text-8xl max-sm:text-[72px] max-sm:leading-[82px] font-bold'>
          <span className='xl:whitespace-nowrap relative z-10 pr-10'>
            Mining Simplified
          </span>
          <br />
          <span className='inline-block mt-3 italic text-4xl text-orange-500'>with</span>{' '}
          <motion.span 
            className='font-montserrat inline-block'
            initial="hidden"
            animate="visible"
            whileHover="hover"
            variants={textVariants}
          >
            BlockFundz
          </motion.span>
        </h1>
        <p className='font-montserrat text-gray-400 text-lg leading-8 mt-6 mb-10 max-w-2xl'>
          Our advanced technology and seamless platform ensures consistent returns, no hardware required.<br />
          Join thousands of miners leveraging our cloud-based solution for reliable and secure earnings.
        </p>

        <div className="flex gap-8">
          <Button
            label="Get Started"
            iconUrl={arrowRight}
            onClick={() => navigate('/signup')}
            iconClass="flex justify-center gap-3 items-center px-5 py-3 bg-orange-500 rounded-full backdrop-filter backdrop-blur-lg shadow-lg hover:bg-opacity-20 transition-all duration-200 text-[#010202] font-semibold outline-1"
          />
          <Button
            label="Learn More"
            iconUrl={arrowRight}
            iconClass="flex justify-center gap-3 items-center px-5 py-3 border-[1.5px] border-[#EEEEEE] rounded-full backdrop-filter backdrop-blur-lg shadow-lg hover:bg-opacity-30 transition-all duration-200 text-white font-semibold outline-1" 
          />
        </div>
      </div>

      <div className='relative top-[40px] flex-1 flex justify-center items-center xl:min-h-screen max-xl:py-40 bg-center'>
        <motion.img
          src={bitguy}
          alt='bitcoin miner illustration'
          width={410}
          height={250}
          className='object-contain relative'
          initial="hidden"
          animate="visible"
          whileHover="hover"
          variants={imageVariants}
        />
      </div>
    </section>
  );
}

export default Hero