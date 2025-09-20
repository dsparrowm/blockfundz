import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaLock, FaEye, FaEyeSlash, FaShieldAlt } from 'react-icons/fa';
import { ArrowRight, Mail, AlertCircle, Shield } from 'lucide-react';
import axiosInstance from '../../../api/axiosInstance';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

interface AdminLoginFormData {
    email: string;
    password: string;
}

const AdminLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<AdminLoginFormData>({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

        try {
            const response = await axiosInstance.post('/api/auth/admin/login', formData);

            if (response.data.success) {
                toast.success('Admin login successful!');
                navigate('/admin/dashboard');
            }
        } catch (err) {
            const axiosError = err as AxiosError;
            const errorMessage = axiosError.response?.data?.message || 'Admin login failed. Please try again.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
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
                <div className="absolute inset-0 bg-gradient-to-r from-navy-900/50 to-transparent z-20"></div>

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
                            Admin Access Portal
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="text-lg opacity-90"
                        >
                            Secure administrative access to manage the platform.
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
                        <div className="w-24 h-24 bg-gold-500/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-gold-500/30">
                            <Shield className="w-12 h-12 text-gold-500" />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-2">
                            Admin Login
                        </h1>
                        <p className="text-gray-200">
                            Access the administrative dashboard
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
                                Admin Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-300" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300/30 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter your admin email"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                                Admin Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLock className="h-5 w-5 text-gray-300" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-12 py-3 border border-gray-300/30 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter your admin password"
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

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
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
                            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    <FaShieldAlt className="h-5 w-5" />
                                    <span>Admin Login</span>
                                    <ArrowRight className="h-5 w-5" />
                                </>
                            )}
                        </motion.button>

                        {/* Back to Homepage Link */}
                        <div className="text-center">
                            <Link
                                to="/"
                                className="text-gray-300 hover:text-gray-200 text-sm transition-colors duration-200"
                            >
                                ← Back to Homepage
                            </Link>
                        </div>
                    </motion.form>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;