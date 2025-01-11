import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const PageWrapper = ({ children }) => {
  const wrapperRef = useRef(null);

  useEffect(() => {
    // Initial page load animation
    const ctx = gsap.context(() => {
      // Animate sections
      gsap.utils.toArray<HTMLElement>('section').forEach((section, i) => {
        // Initial state
        gsap.set(section, {
          opacity: 0,
          y: 50
        });

        // Create scroll trigger for each section
        ScrollTrigger.create({
          trigger: section,
          start: "top 80%",
          onEnter: () => {
            gsap.to(section, {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power3.out",
              delay: i * 0.2 // Stagger effect
            });
          },
          once: true
        });
      });
    }, wrapperRef);

    return () => ctx.revert(); // Cleanup
  }, []);

  return (
    <div ref={wrapperRef}>
      {children}
    </div>
  );
};

export default PageWrapper;