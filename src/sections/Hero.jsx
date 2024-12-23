import Button from '../components/Button'
import { bitguy } from '../assets/images'
import { arrowRight } from "../assets/icons";
// import { statistics } from '../constants';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const [stars, setStars] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    const generateStars = () => {
      const newStars = [];
      for (let i = 0; i < 50; i++) {
        newStars.push({
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDuration: `${Math.random() * 3 + 2}s`,
          size: `${Math.random() * 2 + 1}px`,
        });
      }
      setStars(newStars);
    };

    generateStars();
  }, []);

  return (
    <section
      id='home'
      className='w-full flex xl:flex-row flex-col justify-center bg-coral-black text-white-400 min-h-screen gap-10 max-container'
    >
      <div className='relative xl:w-2/5 flex flex-1 flex-col justify-center items-start w-full  max-xl:padding-x pt-28'>
        {stars.map((star, index) => (
          <div
            key={index}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              animationDuration: star.animationDuration,
            }}
          />
        ))}
        <Button label="100% Transparent"
                iconClass="flex justify-center gap-3 items-center px-5 py-3 border-[1.5px] border-[#EEEEEE] rounded-full backdrop-filter backdrop-blur-lg shadow-lg hover:bg-opacity-30 transition-all duration-200 text-white font-semibold outline-1"
        />
        <h1 className='mt-10 font-palanquin text-8xl max-sm:text-[72px] max-sm:leading-[82px] font-bold'>
          <span className='xl:whitespace-nowrap relative z-10 pr-10'>
            Mining Simplified
          </span>
          <br />
          <span className='inline-block mt-3 italic text-4xl text-orange-500'>with</span> <span className='font-montserrat'>BlockFundz</span>
        </h1>
        <p className='font-montserrat text-gray-400 text-lg leading-8 mt-6 mb-10 max-w-2xl'>
          Our advanced technology and seamless platform ensures consistent returns, no hardware required.<br />Join thousands of miners leveraging our cloud-based solution for reliable and secure earnings.
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
                        iconClass="flex justify-center gap-3 items-center px-5 py-3 border-[1.5px] border-[#EEEEEE] rounded-full backdrop-filter backdrop-blur-lg shadow-lg hover:bg-opacity-30 transition-all duration-200 text-white font-semibold outline-1" />
         </div>
      </div>

      <div className='relative top-[40px] flex-1 flex justify-center items-center xl:min-h-screen max-xl:py-40 bg-center'>
        {stars.map((star, index) => (
          <div
            key={index}
            className="absolute rounded-full bg-orange-500 animate-twinkle inset-0 z-20"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              animationDuration: star.animationDuration,
            }}
          />
        ))}
        <img
          src={bitguy}
          alt='shoe colletion'
          width={410}
          height={250}
          className='object-contain relative'
        />
      </div>
    </section>
  );
}

export default Hero