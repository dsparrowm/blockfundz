import Header from './Header';
import Hero from './Hero';
import CryptoTicker from './CryptoTicker';
import Features from './Features';
import HowItWorks from './HowItWorks';
import Stats from './Stats';
import Pricing from './Pricing';
import Security from './Security';
import Team from './Team';
import Footer from './Footer';

const Landing = () => {
    return (
        <div className="min-h-screen bg-crypto-dark text-white">
            <Header />
            <Hero />
            <div className="container mx-auto px-4 py-8">
                <CryptoTicker />
            </div>
            <Features />
            <HowItWorks />
            <Stats />
            <Pricing />
            <Security />
            <Team />
            <Footer />
        </div>
    );
};

export default Landing;