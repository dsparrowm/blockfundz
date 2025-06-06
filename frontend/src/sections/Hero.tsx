import Button from '../components/Button'
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
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const dashboardVariants = {
    hidden: {
      opacity: 0,
      x: 100,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 1,
        ease: "easeOut",
        delay: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.8 + i * 0.1,
        duration: 0.5
      }
    })
  };

  const barVariants = {
    hidden: { height: 0 },
    visible: (height: number) => ({
      height: `${height}%`,
      transition: {
        delay: 1.2,
        duration: 0.8,
        ease: "easeOut"
      }
    })
  };

  return (
    <section
      id='home'
      className='w-full flex xl:flex-row flex-col justify-center bg-coral-black text-white-400 min-h-screen gap-10 max-container relative overflow-hidden'
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 lg:w-96 lg:h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 lg:w-80 lg:h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Floating Elements */}
        <div className="absolute top-10 left-[10%] w-3 h-3 lg:w-4 lg:h-4 bg-blue-400/20 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
        <div className="absolute top-1/3 right-[20%] w-2 h-2 lg:w-3 lg:h-3 bg-orange-400/20 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
        <div className="absolute bottom-1/3 left-[15%] w-4 h-4 lg:w-5 lg:h-5 bg-blue-300/20 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
      </div>

      <div className='relative xl:w-2/5 flex flex-1 flex-col justify-center items-start w-full max-xl:padding-x pt-28'>
        {/* Professional Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-6"
        >
          <div className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></div>
          Industry Leading Solutions
        </motion.div>

        <motion.h1
          className='mt-6 font-palanquin text-6xl sm:text-7xl lg:text-8xl max-sm:text-5xl max-sm:leading-[60px] font-bold leading-tight'
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          <span className='xl:whitespace-nowrap relative z-10 pr-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'>
            Professional
          </span>
          <br />
          <span className='bg-gradient-to-r from-blue-400 to-orange-500 bg-clip-text text-transparent'>
            Digital Mining
          </span>
          <br />
          <span className='bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'>
            Solutions
          </span>
        </motion.h1>

        <motion.p
          className='font-montserrat text-gray-400 text-lg sm:text-xl leading-8 mt-6 mb-8 max-w-2xl'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Streamline your mining operations with our enterprise-grade digital platform.<br />
          Advanced analytics, real-time monitoring, and automated optimization tools designed for modern mining professionals.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Button
            label="Get Started"
            iconUrl={arrowRight}
            onClick={() => navigate('/signup')}
            iconClass="flex justify-center gap-3 items-center px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-lg backdrop-filter backdrop-blur-lg shadow-lg hover:shadow-xl hover:shadow-orange-500/25 transition-all duration-300 transform hover:-translate-y-1 text-white font-semibold text-lg"
          />
          <Button
            disabled
            label="View Demo"
            iconUrl={arrowRight}
            iconClass="flex justify-center gap-3 items-center px-6 py-4 border-2 border-gray-600 hover:border-gray-500 rounded-lg backdrop-filter backdrop-blur-lg shadow-lg hover:bg-white/5 transition-all duration-300 text-white font-semibold text-lg"
          />
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="mx-auto grid grid-cols-3 gap-6 sm:gap-8 pt-8 border-t border-gray-700/50 w-full max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="text-center xl:text-left">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-orange-500 bg-clip-text text-transparent mb-1">
              500+
            </div>
            <div className="text-gray-500 text-sm sm:text-base">Active Clients</div>
          </div>
          <div className="text-center xl:text-left">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-orange-500 bg-clip-text text-transparent mb-1">
              99.9%
            </div>
            <div className="text-gray-500 text-sm sm:text-base">Uptime</div>
          </div>
          <div className="text-center xl:text-left">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-orange-500 bg-clip-text text-transparent mb-1">
              24/7
            </div>
            <div className="text-gray-500 text-sm sm:text-base">Support</div>
          </div>
        </motion.div>
      </div>

      {/* Professional Dashboard Preview */}
      <div className='relative flex-1 flex justify-center items-center xl:min-h-screen max-xl:py-20 bg-center'>
        <motion.div
          className="w-full max-w-md lg:max-w-lg xl:max-w-xl"
          initial="hidden"
          animate="visible"
          variants={dashboardVariants}
        >
          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 lg:p-8 shadow-2xl">
            {/* Dashboard Header */}
            <motion.div
              className="flex justify-between items-center mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <h3 className="text-xl font-semibold text-white">Mining Dashboard</h3>
              <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                Live
              </div>
            </motion.div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 lg:gap-4 mb-6">
              {[
                { value: "2,847", label: "Active Miners", color: "blue" },
                { value: "12.4 TH/s", label: "Hash Rate", color: "blue" },
                { value: "$45,230", label: "Daily Revenue", color: "orange" },
                { value: "98.7%", label: "Efficiency", color: "orange" }
              ].map((metric, index) => (
                <motion.div
                  key={index}
                  className={`bg-${metric.color}-500/10 border border-${metric.color}-500/20 rounded-lg p-3 lg:p-4`}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                >
                  <div className={`text-xl lg:text-2xl font-bold text-${metric.color}-400 mb-1`}>
                    {metric.value}
                  </div>
                  <div className="text-gray-400 text-xs uppercase tracking-wide">
                    {metric.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Chart Placeholder */}
            <motion.div
              className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 h-28 lg:h-32 flex items-center justify-center relative overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <div className="flex items-end gap-1 h-16 lg:h-20">
                {[40, 60, 35, 55, 45, 65, 50, 70, 45, 55, 40, 60].map((height, index) => (
                  <motion.div
                    key={index}
                    className="bg-gradient-to-t from-orange-600 to-orange-400 rounded-sm w-2 lg:w-3"
                    custom={height}
                    initial="hidden"
                    animate="visible"
                    variants={barVariants}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  />
                ))}
              </div>

              {/* Trending Icon */}
              <div className="absolute top-2 right-2">
                <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero