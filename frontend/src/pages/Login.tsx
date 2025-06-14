import { FaUser, FaLock, FaTimes } from "react-icons/fa";
import { logo } from "../assets/icons";
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { useStore } from "../store/useStore";
import Cookies from 'js-cookie';
import axiosInstance from "../api/axiosInstance";
import Spinner from "../components/spinners/Spinner";
import Toast from "../utils/Toast";
import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ZodErrorResponse {
  message: string;
  errors?: Array<{
    path: string;
    message: string;
  }>;
}

interface LoginFormData {
  email: string;
  password: string;
}

interface FormErrors {
  [key: string]: string;
}

const Login = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [error, setError] = useState<FormErrors>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [forgotDialogOpen, setForgotDialogOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState<string | null>(null);

  const setUser = useStore(state => state.setUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (globalError) {
      const timer = setTimeout(() => setGlobalError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [globalError]);

  // Auto-close Toast after 3 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (error[name]) {
      setError(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    if (globalError) setGlobalError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError({});
    setGlobalError(null);
    setToastMessage(null);
    setShowToast(false);
    setLoading(true);

    try {
      const response = await axiosInstance.post(`api/auth/signin`, formData, {
        withCredentials: true
      });

      setUser({
        ...response.data.user,
        mainBalance: response.data.user.mainBalance ?? 0
      });

      localStorage.setItem("userId", response.data.user.id);
      localStorage.setItem("userEmail", response.data.user.email);
      Cookies.set("token", response.data.token, {
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      localStorage.setItem("isLoggedIn", "yes");

      setToastMessage({ type: 'success', message: "Login successful!" });
      setShowToast(true);

      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      let errorMessage = "Login failed";

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ZodErrorResponse>;

        if ([400, 401, 404, 403].includes(axiosError.response?.status || 0)) {
          if (axiosError.response?.data?.errors) {
            const formErrors = axiosError.response.data.errors.reduce((acc: FormErrors, err) => {
              if (err.path in formData) {
                acc[err.path] = err.message;
              }
              return acc;
            }, {});

            setError(formErrors);
            errorMessage = "Please fix the form errors";
          } else {
            errorMessage = axiosError.response?.data?.message || errorMessage;
          }
        }
      }

      setGlobalError(errorMessage);
      setToastMessage({ type: 'error', message: errorMessage });
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotMessage(null);
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:3001"}/api/auth/forgot-password`, {
        email: forgotEmail,
      });
      setToastMessage({ type: 'success', message: "If this email exists, a reset link has been sent." });
      setShowToast(true);
      setForgotDialogOpen(false);
      setForgotEmail('');
    } catch (err) {
      setToastMessage({ type: 'error', message: "Failed to send reset link. Please try again." });
      setShowToast(true);
      setForgotDialogOpen(false);
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <main className="relative text-white flex justify-center items-center min-h-screen p-4 flex-col bg-crypto-dark">
      {/* Toast Container */}
      {showToast && toastMessage && (
        <Toast
          type={toastMessage.type}
          message={toastMessage.message}
          onClose={() => setShowToast(false)}
        />
      )}

      {/* Forgot Password Dialog */}
      <Dialog open={forgotDialogOpen} onOpenChange={setForgotDialogOpen}>
        <DialogContent className="max-w-md bg-gradient-to-br from-orange-500/90 to-orange-700/90 border-0 shadow-2xl rounded-2xl p-0">
          <div className="flex flex-col items-center py-8 px-6">
            <div className="bg-white/10 rounded-full p-3 mb-4">
              <FaLock className="text-3xl text-white" />
            </div>
            <DialogHeader className="w-full text-center">
              <DialogTitle className="text-2xl font-bold text-white mb-1">Forgot Password?</DialogTitle>
              <DialogDescription className="text-white/80 mb-4">
                Enter your email address and we'll send you a password reset link.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleForgotPassword} className="w-full space-y-4">
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-orange-400/40 transition"
                value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)}
                disabled={forgotLoading}
                autoFocus
              />
              <button
                type="submit"
                disabled={forgotLoading}
                className="w-full bg-white/20 text-white font-semibold rounded-lg py-3 hover:bg-white/30 transition-all duration-200 border border-white/10 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {forgotLoading ? <Spinner size="sm" /> : "Send Reset Link"}
              </button>
            </form>
            <button
              type="button"
              className="mt-6 text-white/70 hover:text-white text-xs underline"
              onClick={() => setForgotDialogOpen(false)}
              tabIndex={0}
            >
              Back to Login
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Logo and NexGen on the same line */}
      <div className="flex items-center justify-center space-x-3 mb-5 cursor-pointer" onClick={() => navigate('/')}>
        <div className="w-8 h-8 bg-crypto-gradient rounded-lg flex items-center justify-center">
          {logo ? (
            <img src={logo} alt="NexGen Logo" className="w-6 h-6 logo" />
          ) : (
            <Bitcoin className="w-6 h-6 text-white" />
          )}
        </div>
        <span className="text-3xl text-white font-bold">
          Nex<span className="text-crypto-blue">Gen</span>
        </span>
      </div>

      {/* Login Form */}
      <div className="relative backdrop-blur-lg bg-crypto-card-dark/80 p-8 rounded-2xl shadow-xl border border-white/10 w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          disabled={loading}
        >
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
              <p className="text-white/60">Sign in to your account</p>
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-white/80 text-sm font-medium pl-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center">
                <FaUser className="h-5 w-5 text-white/40" />
              </div>
              <input
                name="email"
                type="email"
                value={formData.email}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-11 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Enter your email"
                onChange={handleChange}
                disabled={loading}
              />
              {error.email && (
                <p className="text-red-500 text-sm mt-1">{error.email}</p>
              )}
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-white/80 text-sm font-medium pl-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center">
                <FaLock className="h-5 w-5 text-white/40" />
              </div>
              <input
                name="password"
                type="password"
                value={formData.password}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-11 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Enter your password"
                onChange={handleChange}
                disabled={loading}
              />
              {error.password && (
                <p className="text-red-500 text-sm mt-1">{error.password}</p>
              )}
            </div>
          </div>

          {/* Form Footer */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2 text-white/80">
              <input
                type="checkbox"
                className="rounded border-white/20 bg-white/5"
                disabled={loading}
              />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              className="text-white/80 hover:text-white"
              disabled={loading}
              onClick={() => setForgotDialogOpen(true)}
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="crypto-button text-white w-full py-3 rounded-lg font-semibold mt-4"
          >
            {loading ? <Spinner /> : "Sign In"}
          </button>

          {/* Signup Link */}
          <p className="text-center text-white/60">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="hover:underline text-blue-400 hover:text-blue-500 transition-colors duration-200"
              aria-disabled={loading}
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}

export default Login;