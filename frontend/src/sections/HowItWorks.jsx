import { User, UserCircle } from "lucide-react";
import { ArrowRight, Landmark, Shield, TrendingUp, Wallet } from "lucide-react";
import FeatureCard from "../components/FeatureCard";
import { motion } from "framer-motion";
import { fadeIn } from "../variants";

const HowItWorks = () => {
  const steps = [
    {
      icon: Wallet,
      title: "Create an Account",
      description: "Sign up for a free account and complete our KYC process to start investing in crypto assets."
    },
    {
      icon: Landmark,
      title: "Choose Your Plan",
      description: "Select from our range of investment plans, each designed to match different risk appetites and goals."
    },
    {
      icon: TrendingUp,
      title: "Watch Your Returns",
      description: "Track your investments in real-time and earn competitive returns on your crypto assets."
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "Secure & Transparent",
      description: "Your investments are protected by industry-leading security measures and smart contracts."
    }
  ];

  return (
    <div className="max-container mx-auto">
      {/* Section Header */}
      <motion.div
        variants={fadeIn("up", 0.2)}
        initial="hidden"
        whileInView={"show"}
        viewport={{ once: false, amount: 0.7 }}
        className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-500 to-blue-500 mb-4 text-gradient">
          How It Works
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto font-bold">
          Start earning returns on your crypto investments in three simple steps.
          Our platform makes it easy to invest and track your portfolio.
        </p>
      </motion.div>

      {/* Steps */}
      <motion.div
        variants={fadeIn("right", 0.4)}
        initial="hidden"
        whileInView={"show"}
        viewport={{ once: false, amount: 0.5 }}

        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            <FeatureCard {...step} />
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                <ArrowRight className="h-6 w-6 text-gray-600" />
              </div>
            )}
          </div>
        ))}
      </motion.div>

      {/* Additional Features */}
      <div className="text-center">
        {features.map((feature, index) => (
          <div key={index} className="inline-block max-w-sm bg-gray-800/50">
            <FeatureCard {...feature} />
          </div>
        ))}
      </div>

      {/* CTA Button */}
      {/* <div className="text-center mt-12">
          <button className="bg-orange-700 text-white font-bold py-3 px-8 rounded-full hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
            Start Investing Now
          </button>
        </div> */}
      <div className="mt-16 text-center">
        <div className="inline-flex items-center space-x-2 bg-gray-800/50 backdrop-blur-lg rounded-full px-4 py-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-gray-400 text-sm">
            Secured by industry-leading smart contracts
          </span>
        </div>
      </div>

    </div>
  );
};


export default HowItWorks