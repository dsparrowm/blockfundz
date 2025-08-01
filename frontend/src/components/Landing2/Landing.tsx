import Header from './Header';
import Hero from './HeroNew';
import Features from './Features';
import HowItWorks from './HowItWorks';
import Stats from './Stats';
import Pricing from './Pricing';
import PersonalWealth from './PersonalWealth';
import Team from './Team';
import Footer from './Footer';

const Landing = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-inter">
            <Header />
            <Hero />
            <Features />
            <HowItWorks />
            <Stats />
            <Pricing />
            <PersonalWealth />
            <Team />
            <Footer />
        </div>
    );
};

export default Landing;