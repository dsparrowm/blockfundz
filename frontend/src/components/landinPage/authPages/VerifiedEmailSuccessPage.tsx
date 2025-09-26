import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import NexGenLogo from '../../ui/NexGenLogo';

const VerifiedEmailSuccessPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-navy-900 flex">
            {/* Left Side - Image */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-black/40 z-10"></div>
                <img
                    src="/happyclient.png"
                    alt="Happy Client - Success Story"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-navy-900/40 to-transparent z-20"></div>

                {/* Overlay Content */}
                <div className="absolute inset-0 flex items-center justify-center text-white z-30 p-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-center max-w-md"
                    >
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="text-3xl font-bold mb-4"
                        >
                            Welcome to NexGen
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="text-lg opacity-90"
                        >
                            Your email has been successfully verified. You're now ready to start your investment journey.
                        </motion.p>
                    </motion.div>
                </div>
            </motion.div>

            {/* Right Side - Success Message */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full lg:w-1/2 flex items-center justify-center p-8"
            >
                <div className="w-full max-w-md text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="mb-8"
                    >
                        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                        <h1 className="text-4xl font-bold text-white mb-4">
                            Email Verified!
                        </h1>
                        <p className="text-gray-200 text-lg mb-6">
                            Congratulations! Your email has been successfully verified.
                            You can now access all features of your NexGen account.
                        </p>
                        <div className="bg-green-900/30 border border-green-800/50 rounded-lg p-4 mb-6">
                            <p className="text-green-400 text-sm">
                                ✅ Email verification complete<br />
                                ✅ Account fully activated<br />
                                ✅ Ready to start investing
                            </p>
                        </div>
                    </motion.div>

                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        onClick={() => navigate('/login')}
                        className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-semibold rounded-lg transition-all duration-200"
                    >
                        Continue to Login
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </motion.button>


                </div>
            </motion.div>
        </div>
    );
};

export default VerifiedEmailSuccessPage;