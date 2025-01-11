import React, { useEffect, useRef, createContext, useContext, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Loading Context
const LoadingContext = createContext<{
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  isLoading: true,
  setIsLoading: () => {}
});

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Increased time to allow counter to complete
    return () => clearTimeout(timer);
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);

const Preloader = () => {
  const { isLoading } = useLoading();
  const preloaderRef = useRef(null);
  const counterRef = useRef(null);
  const logoRef = useRef(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (preloaderRef.current && isLoading) {
      // Create main timeline
      const tl = gsap.timeline();

      // Counter animation
      tl.to(counterRef.current, {
        duration: 2.5,
        onUpdate: () => {
          const progress = Math.round(tl.progress() * 100);
          setCount(progress);
        },
      });

      // Logo pulse animation
      gsap.to(logoRef.current, {
        scale: 1.1,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });

      return () => {
        tl.kill();
      };
    }
  }, [isLoading]);

  useEffect(() => {
    if (preloaderRef.current && !isLoading) {
      // Exit animation
      gsap.to(preloaderRef.current, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          gsap.set(preloaderRef.current, { display: 'none' });
        }
      });
    }
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-coral-black"
    >
      <div className="text-center">
        <h1 
          ref={logoRef}
          className="text-4xl font-bold mb-8 text-primary"
        >
          NexGenCrypto
        </h1>
        
        <div 
          ref={counterRef}
          className="text-white text-xl font-semibold"
        >
          {count}%
        </div>
      </div>
    </div>
  );
};

export default Preloader;