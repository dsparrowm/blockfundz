import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { FaLock, FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import { ArrowRight, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import axiosInstance from '../../../api/axiosInstance';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import NexGenLogo from '../../ui/NexGenLogo';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        try {
            const response = await axiosInstance.post('/api/auth/reset-password', {
                token,
                password: formData.password,
            });

            if (response.data.isSuccess) {
                setSuccess(true);
                toast.success('Password reset successful! You can now log in.');
                setTimeout(() => navigate('/login'), 3000);
            }
        } catch (err) {
            const axiosError = err as AxiosError;
            const errorMessage = axiosError.response?.data?.message || 'Failed to reset password. The link may have expired.';
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
                                Password Reset Successful!
                            </h1>
                            <p className="text-gray-200 mb-6">
                                Your password has been successfully updated.
                            </p>
                            <p className="text-gray-300 text-sm mb-8">
                                You will be redirected to the login page in a few seconds...
                            </p>
                        </motion.div>

                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            onClick={() => navigate('/login')}
                            className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-semibold rounded-lg transition-all duration-200"
                        >
                            Go to Login
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </motion.button>
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
                            Secure Your Account
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="text-lg opacity-90"
                        >
                            Create a strong password to protect your investments and personal data.
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
                            Reset Password
                        </h1>
                        <p className="text-gray-200">
                            Enter your new password below
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
                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-300" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-12 py-3 border border-gray-300/30 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter new password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? (
                                        <FaEyeSlash className="h-5 w-5 text-gray-300 hover:text-gray-200" />
                                    ) : (
                                        <FaEye className="h-5 w-5 text-gray-300 hover:text-gray-200" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 mb-2">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-300" />
                                </div>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-12 py-3 border border-gray-300/30 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Confirm new password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showConfirmPassword ? (
                                        <FaEyeSlash className="h-5 w-5 text-gray-300 hover:text-gray-200" />
                                    ) : (
                                        <FaEye className="h-5 w-5 text-gray-300 hover:text-gray-200" />
                                    )}
                                </button>
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
                                    Reset Password
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
                        className="mt-8 text-center"
                    >
                        <button
                            onClick={() => navigate('/login')}
                            className="flex items-center justify-center text-gold-400 hover:text-gold-300 font-semibold transition-colors duration-200 mx-auto"
                        >
                            <FaArrowLeft className="mr-2 w-4 h-4" />
                            Back to Login
                        </button>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default ResetPassword;