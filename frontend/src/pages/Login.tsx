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

  const setUser = useStore(state => state.setUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (globalError) {
      const timer = setTimeout(() => setGlobalError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [globalError]);

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

      navigate('/dashboard');
    } catch (error) {
      let errorMessage = "Login failed";

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ZodErrorResponse>;

        if ([400, 401, 404].includes(axiosError.response?.status || 0)) {
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
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative text-white flex justify-center items-center min-h-screen p-4 flex-col">
      {/* Toast Container */}
      {showToast && globalError && (
        <Toast
          type="error"
          message={globalError}
          onClose={() => setShowToast(false)}
        />
      )}

      {/* Accessibility Announcements */}
      <div aria-live="assertive" className="sr-only">
        {globalError && <p>{globalError}</p>}
      </div>

      {/* Logo */}
      <div className="mb-2 flex items-center cursor-pointer" onClick={() => navigate('/')}>
        <span className='text-3xl text-orange-500 mr-1 pt-2'>
          <img src={logo} alt="logo" width={50} height={10} />
        </span>
        <p className='text-[30px] text-white leading-8'>Nex<span className="text-orange-500">Gen</span></p>
      </div>

      {/* Login Form */}
      <div className="relative backdrop-blur-lg bg-white/5 p-8 rounded-2xl shadow-xl border border-white/10 w-full max-w-md">
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
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white/10 text-white rounded-lg py-3 font-medium hover:bg-white/20 transition-all duration-300 border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Spinner /> : "Sign In"}
          </button>

          {/* Signup Link */}
          <p className="text-center text-white/60">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="hover:underline text-orange-500"
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