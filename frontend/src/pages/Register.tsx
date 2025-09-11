import React, { useState, useEffect } from "react";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import { useStore } from '../store/useStore';
import NexGenLogo from "../components/ui/NexGenLogo";
import axiosInstance from "../api/axiosInstance";
import { toast } from "sonner";
import { AxiosError } from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

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
      toast.error("Passwords do not match");
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
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div aria-live="assertive" className="sr-only">
        {globalError && <p>{globalError}</p>}
      </div>

      <div className="w-full max-w-md space-y-8">
        {/* Logo Section */}
        <div className="text-center">
          <div
            className="inline-block cursor-pointer"
            onClick={() => navigate('/')}
          >
            <NexGenLogo variant="full" size="lg" />
          </div>
        </div>

        {/* Main Register Card */}
        <Card className="shadow-2xl border-2xl bg-white/10 backdrop-blur-sm border-white/40">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-black">
              Create your account
            </CardTitle>
            <CardDescription className="text-blackred">
              Join NexGen and start investing today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-black">
                  Full Name
                </Label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formValues.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="pl-10 bg-white/20 border-white/30 text-black placeholder-gray-600 focus:border-white/50"
                    disabled={loading}
                    required
                  />
                </div>
                {error.name && (
                  <p className="text-red-500 text-sm">{error.name}</p>
                )}
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-black">
                  Email Address
                </Label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formValues.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    className="pl-10 bg-white/20 border-white/30 text-black placeholder-gray-600 focus:border-white/50"
                    disabled={loading}
                    required
                  />
                </div>
                {error.email && (
                  <p className="text-red-500 text-sm">{error.email}</p>
                )}
              </div>

              {/* Phone Input */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-black">
                  Phone Number
                </Label>
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
                    height: '42px',
                    fontSize: '14px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    outline: 'none',
                    color: '#111112ff',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    paddingLeft: '3rem'
                  }}
                  containerStyle={{
                    width: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    height: '42px',
                    borderRadius: '6px',
                  }}
                  buttonStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                  }}
                  dropdownStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: '#f3f4f6',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                  }}
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-black">
                  Password
                </Label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formValues.password}
                    onChange={handleInputChange}
                    placeholder="Create a strong password"
                    className="pl-10 bg-white/20 border-white/30 text-black placeholder-gray-600 focus:border-white/50"
                    disabled={loading}
                    required
                  />
                </div>
                {error.password && (
                  <p className="text-red-500 text-sm">{error.password}</p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-black">
                  Confirm Password
                </Label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formValues.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className="pl-10 bg-white/20 border-white/30 text-black placeholder-gray-600 focus:border-white/50"
                    disabled={loading}
                    required
                  />
                </div>
                {error.confirmPassword && (
                  <p className="text-red-500 text-sm">{error.confirmPassword}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-bloodred-dark hover:bg-blackred text-white py-3"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>

              {/* Sign In Link */}
              <div className="text-center pt-4 border-t border-white/20">
                <p className="text-sm text-black">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-blue-500 hover:text-purple-300 font-medium hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;