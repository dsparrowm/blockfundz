import { FaUser, FaLock } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { useStore } from "../store/useStore";
import NexGenLogo from "../components/ui/NexGenLogo";
import Cookies from 'js-cookie';
import axiosInstance from "../api/axiosInstance";
import { toast } from "sonner";
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";

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
        secure: import.meta.env.MODE === 'production',
        sameSite: 'strict'
      });
      localStorage.setItem("isLoggedIn", "yes");

      toast.success("Login successful!");

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
      toast.error(errorMessage);
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
      toast.success("If this email exists, a reset link has been sent.");
      setForgotDialogOpen(false);
      setForgotEmail('');
    } catch (err) {
      toast.error("Failed to send reset link. Please try again.");
      setForgotDialogOpen(false);
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center bg-timberwolf-light border-2xl justify-center p-4">

      {/* Forgot Password Dialog */}
      <Dialog open={forgotDialogOpen} onOpenChange={setForgotDialogOpen}>
        <DialogContent className="max-w-md !bg-white !border-gray-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 !text-gray-100">
              <FaLock className="text-black" />
              <span className="text-black">Forgot Password?</span>
            </DialogTitle>
            <DialogDescription className="!text-blackred">
              Enter your email address and we'll send you a password reset link.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="forgot-email" className="!text-black">Email Address</Label>
              <Input
                id="forgot-email"
                type="email"
                required
                placeholder="Enter your email"
                value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)}
                disabled={forgotLoading}
                autoFocus
                className="!bg-white/50 !text-black placeholder:!text-black"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setForgotDialogOpen(false)}
                className="flex-1 !border-gray-600 !text-black hover:!bg-gray-700 hover:!text-white"
                disabled={forgotLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={forgotLoading}
                className="flex-1 bg-bloodred-dark hover:bg-blackred"
              >
                {forgotLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

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

        {/* Main Login Card */}
        <Card className="shadow-lg !bg-white/10 !backdrop-blur-sm !border-white/40">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold !text-black">
              Welcome back
            </CardTitle>
            <CardDescription className="!text-blackred">
              Sign in to your NexGen account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium !text-black">
                  Email address
                </Label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="pl-10 !bg-white/20 !border-white/30 !text-black placeholder:!text-gray-600 focus:!border-white/50"
                    disabled={loading}
                    required
                  />
                </div>
                {error.email && (
                  <p className="text-red-500 text-sm">{error.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium !text-black">
                  Password
                </Label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="pl-10 !bg-white/20 !border-white/30 !text-black placeholder:!text-gray-600 focus:!border-white/50"
                    disabled={loading}
                    required
                  />
                </div>
                {error.password && (
                  <p className="text-red-500 text-sm">{error.password}</p>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-bloodred hover:text-purple-300"
                  onClick={() => setForgotDialogOpen(true)}
                  disabled={loading}
                >
                  Forgot your password?
                </Button>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-bloodred-dark hover:bg-blackred text-white py-3"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>

              {/* Register Link */}
              <div className="text-center pt-4 border-t !border-white/20">
                <p className="text-sm !text-black">
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    className="text-blue-500 hover:text-purple-300 font-medium hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Login;