import React from 'react';
import Navbar from './Nav';
import Hero from './Hero';
import About from './About';
import Services from './Services';
import Dividends from './Dividends';
import Testimonials from './Testimonials';
import CTA from './CTA';
import Contact from './Contact';
import Footer from './Footer';

const Landing = () => {
    return (
        <div className="min-h-screen bg-navy-900 text-white overflow-x-hidden">
            <Navbar />
            <Hero />
            <About />
            <Services />
            <Dividends />
            <Testimonials />
            <CTA />
            <Contact />
            <Footer />
        </div>
    );
};

export default Landing;