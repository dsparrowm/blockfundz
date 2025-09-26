import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaArrowLeft } from 'react-icons/fa';
import { ArrowRight, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import axiosInstance from '../../../api/axiosInstance';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import NexGenLogo from '../../ui/NexGenLogo';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axiosInstance.post('/api/auth/forgot-password', { email });

            if (response.data.isSuccess) {
                setSuccess(true);
                toast.success('Password reset link sent to your email!');
            }
        } catch (err) {
            const axiosError = err as AxiosError;
            const errorMessage = axiosError.response?.data?.message || 'Failed to send reset link. Please try again.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
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
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <h1 className="text-3xl font-bold text-white mb-4">
                                Check Your Email
                            </h1>
                            <p className="text-gray-200 mb-6">
                                We've sent a password reset link to <strong>{email}</strong>
                            </p>
                            <p className="text-gray-300 text-sm mb-8">
                                Click the link in the email to reset your password. The link will expire in 1 hour.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="space-y-4"
                        >
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-semibold rounded-lg transition-all duration-200"
                            >
                                Back to Login
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </button>

                            <p className="text-gray-300 text-sm">
                                Didn't receive the email?{' '}
                                <button
                                    onClick={() => setSuccess(false)}
                                    className="text-gold-400 hover:text-gold-300 font-semibold transition-colors duration-200"
                                >
                                    Try again
                                </button>
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        );
    }

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
                            Reset Your Password
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="text-lg opacity-90"
                        >
                            Enter your email address and we'll send you a link to reset your password.
                        </motion.p>
                    </motion.div>
                </div>
            </motion.div>

            {/* Right Side - Form */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full lg:w-1/2 flex items-center justify-center p-8"
            >
                <div className="w-full max-w-md">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-center mb-8"
                    >
                        <div className="flex items-center justify-center mb-4">
                            <NexGenLogo variant="icon" size="lg" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Forgot Password
                        </h1>
                        <p className="text-gray-200">
                            Enter your email to receive a reset link
                        </p>
                    </motion.div>

                    {/* Form */}
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-300" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300/30 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center space-x-2 text-red-400 bg-red-900/30 border border-red-800/50 rounded-lg p-3"
                            >
                                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                <span className="text-sm">{error}</span>
                            </motion.div>
                        )}

                        {/* Submit Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Send Reset Link
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </>
                            )}
                        </motion.button>
                    </motion.form>

                    {/* Footer Links */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="mt-8 text-center space-y-4"
                    >
                        <div className="text-gray-300">
                            <button
                                onClick={() => navigate('/login')}
                                className="flex items-center justify-center text-gold-400 hover:text-gold-300 font-semibold transition-colors duration-200 mx-auto"
                            >
                                <FaArrowLeft className="mr-2 w-4 h-4" />
                                Back to Login
                            </button>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;