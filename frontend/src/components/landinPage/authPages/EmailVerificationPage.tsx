import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { ArrowRight, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import axiosInstance from '../../../api/axiosInstance';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { useStore } from '../../../store/useStore';
import NexGenLogo from '../../ui/NexGenLogo';

const EmailVerificationPage = () => {
    const [verificationCode, setVerificationCode] = useState<string[]>(Array(6).fill(''));
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const userEmail = useStore(state => state.userEmail);

    useEffect(() => {
        return () => {
            // Cleanup any intervals when component unmounts
            setResendCooldown(0);
        };
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = e.target;
        if (/^\d*$/.test(value) && value.length <= 1) {
            const newCode = [...verificationCode];
            newCode[index] = value;
            setVerificationCode(newCode);
            setError('');

            // Move to the next input field
            if (value && index < inputRefs.current.length - 1) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const code = verificationCode.join('');
        console.log('Submitting verification code:', { code, email: userEmail, codeLength: code.length });

        if (code.length !== 6) {
            setError('Please enter the complete 6-digit verification code');
            setLoading(false);
            return;
        }

        try {
            const response = await axiosInstance.post('/api/auth/verify-email', {
                code,
                email: userEmail
            });

            if (response.data.isSuccess) {
                toast.success('Email verified successfully!');
                navigate('/email-verified');
            }
        } catch (err) {
            const axiosError = err as AxiosError;
            const errorMessage = axiosError.response?.data?.message || 'Invalid verification code. Please try again.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (resendCooldown > 0) return;

        setResendLoading(true);
        try {
            const response = await axiosInstance.post('/api/auth/resend-verification-code', {
                email: userEmail
            });

            if (response.data.isSuccess) {
                toast.success('Verification code sent! Check your email.');
                // Clear the current code input
                setVerificationCode(Array(6).fill(''));
                // Set cooldown for 30 seconds
                setResendCooldown(30);
                const interval = setInterval(() => {
                    setResendCooldown(prev => {
                        if (prev <= 1) {
                            clearInterval(interval);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            }
        } catch (err) {
            const axiosError = err as AxiosError;
            const errorMessage = axiosError.response?.data?.message || 'Failed to resend code';
            toast.error(errorMessage);
        } finally {
            setResendLoading(false);
        }
    };

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
                            Verify Your Email
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="text-lg opacity-90"
                        >
                            Check your inbox for a 6-digit verification code to complete your account setup.
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
                            Email Verification
                        </h1>
                        <p className="text-gray-200">
                            Enter the 6-digit code sent to{' '}
                            <span className="text-gold-400 font-semibold">{userEmail}</span>
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
                        {/* Verification Code Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-4 text-center">
                                Verification Code
                            </label>
                            <div className="flex justify-center space-x-3">
                                {verificationCode.map((code, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        value={code}
                                        onChange={(e) => handleChange(e, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        className="w-12 h-12 text-center text-xl border border-gray-300/30 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-200"
                                        maxLength={1}
                                    />
                                ))}
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
                                    Verify Email
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
                        <p className="text-gray-300">
                            Didn't receive the code?{' '}
                            <button
                                onClick={handleResendCode}
                                disabled={resendLoading || resendCooldown > 0}
                                className={`font-semibold transition-colors duration-200 ${resendLoading || resendCooldown > 0
                                    ? 'text-gray-500 cursor-not-allowed'
                                    : 'text-gold-400 hover:text-gold-300'
                                    }`}
                            >
                                {resendLoading
                                    ? 'Sending...'
                                    : resendCooldown > 0
                                        ? `Resend in ${resendCooldown}s`
                                        : 'Resend Code'
                                }
                            </button>
                        </p>

                        <button
                            onClick={() => navigate('/signup')}
                            className="flex items-center justify-center text-gray-300 hover:text-gray-200 transition-colors duration-200 mx-auto"
                        >
                            <FaArrowLeft className="mr-2 w-4 h-4" />
                            Back to Signup
                        </button>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default EmailVerificationPage;