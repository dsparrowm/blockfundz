import React, { useState, useEffect } from "react";
import { FaUser, FaLock, FaTimes } from "react-icons/fa";
import { crypto_logo } from "../assets/icons";
import { Link, useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useStore } from '../store/useStore';
import axiosInstance from "../api/axiosInstance";
import Spinner from "../components/spinners/Spinner";
import Toast from "../utils/Toast";
import { AxiosError } from 'axios';

interface FormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

interface ZodErrorResponse {
  errors: Array<{ path: string; message: string }>;
  message: string;
}

const Register = () => {
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Record<string, string>>({});
  const [phone, setPhone] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });

  const navigate = useNavigate();
  const setUser = useStore(state => state.setUser);
  const setUserEmail = useStore(state => state.setUserEmail);

  useEffect(() => {
    if (globalError) {
      const timer = setTimeout(() => setGlobalError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [globalError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value,
      phone: phone
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError({});
    setGlobalError(null);

    if (formValues.password !== formValues.confirmPassword) {
      setError({ confirmPassword: "Passwords do not match" });
      setGlobalError("Passwords do not match");
      setShowToast(true);
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post(`/api/auth/signup`, formValues);

      if (response.status === 200) {
        setUser(response.data.createdUser);
        setUserEmail(response.data.createdUser.email);
        navigate('/verify-email');
      }
    } catch (error) {
      let errorMessage = "Registration failed";

      if (error instanceof AxiosError) {
        const axiosError = error as AxiosError<ZodErrorResponse>;

        if ([400, 401, 409].includes(axiosError.response?.status || 0)) {
          if (axiosError.response?.data?.errors) {
            const formErrors = axiosError.response.data.errors.reduce((acc: Record<string, string>, err) => {
              if (err.path in formValues) {
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
    <main className="relative flex justify-center items-center min-h-screen p-4 flex-col bg-black">
      {showToast && globalError && (
        <Toast
          type="error"
          message={globalError}
          onClose={() => setShowToast(false)}
        />
      )}

      <div aria-live="assertive" className="sr-only">
        {globalError && <p>{globalError}</p>}
      </div>

      <div className="flex items-center justify-center space-x-3 mb-5 cursor-pointer" onClick={() => navigate('/')}>

        {crypto_logo ? (
          <img src={crypto_logo} alt="NexGen Logo" className="w-8 h-8 " />
        ) : (
          <Bitcoin className="w-6 h-6 text-white" />
        )}
        <span className="text-3xl text-white font-bold">
          Nex<span className="text-[#3B82F6]">Gen</span>
        </span>
      </div>

      <div className="relative backdrop-blur-lg bg-dark-blue/80 p-8 rounded-2xl shadow-xl border border-white/10 w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6" disabled={loading}>
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
              <p className="text-white/60">Sign up to get started</p>
            </div>
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <label className="text-white/80 text-sm font-medium pl-1">Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center">
                <FaUser className="h-5 w-5 text-white/40" />
              </div>
              <input
                type="text"
                name="name"
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-11 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Full Name"
                disabled={loading}
              />
              {error.name && <p className="text-red-500 text-sm mt-1">{error.name}</p>}
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
                type="email"
                name="email"
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-11 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Enter your email"
                disabled={loading}
              />
              {error.email && <p className="text-red-500 text-sm mt-1">{error.email}</p>}
            </div>
          </div>

          {/* Phone Input */}
          <div className="space-y-2">
            <label className="text-white/80 text-sm font-medium pl-1">Phone</label>
            <PhoneInput
              country="us"
              value={phone}
              onChange={phone => {
                setPhone(phone);
                setFormValues(prev => ({ ...prev, phone }));
              }}
              inputProps={{
                name: 'phone',
                required: true,
                disabled: loading
              }}
              inputStyle={{
                width: '100%',
                height: '50px',
                fontSize: '16px',
                borderRadius: '0.375rem',
                border: '1px solid rgb(255 255 255 / 0.1)',
                outline: 'none',
                color: '#FFFFFF',
                backgroundColor: 'rgb(255 255 255 / 0.05)',
                paddingLeft: '3rem'
              }}
              containerStyle={{
                width: '100%',
                backgroundColor: 'rgb(255 255 255 / 0.05)',
                border: '1px solid rgb(255 255 255 / 0.1)',
                height: '50px',
                borderRadius: '8px',
              }}
              buttonStyle={{
                backgroundColor: 'rgb(255 255 255 / 0.05)',
                border: 'none',
              }}
              dropdownStyle={{
                backgroundColor: '#262626',
                color: '#666666',
                border: '1px solid #1A1A1A',
              }}
            />
          </div>

          {/* Password Inputs */}
          <div className="space-y-2">
            <label className="text-white/80 text-sm font-medium pl-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center">
                <FaLock className="h-5 w-5 text-white/40" />
              </div>
              <input
                name="password"
                type="password"
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-11 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Enter your password"
                disabled={loading}
              />
              {error.password && <p className="text-red-500 text-sm mt-1">{error.password}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-white/80 text-sm font-medium pl-1">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center">
                <FaLock className="h-5 w-5 text-white/40" />
              </div>
              <input
                name="confirmPassword"
                type="password"
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-11 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Confirm your password"
                disabled={loading}
              />
              {error.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{error.confirmPassword}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600
             text-white w-full py-3 rounded-lg font-semibold mt-4"
          >
            {loading ? <Spinner /> : 'Sign Up'}
          </button>

          <p className="text-center text-white/60">
            Already have an account?{' '}
            <Link
              to="/login"
              className="hover:underline text-orange-500 hover:text-orange-600 transition-colors duration-200"
              aria-disabled={loading}
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
};

export default Register;