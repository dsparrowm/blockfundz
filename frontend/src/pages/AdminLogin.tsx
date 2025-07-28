import React from "react";
import { FaUser, FaLock } from "react-icons/fa";
import NexGenLogo from "../components/ui/NexGenLogo";
import { useState } from 'react';
import { useStore } from "../store/useStore";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import axiosInstance from "../api/axiosInstance";


// Type for Zod error response
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


const Login = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [error, setError] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const setAdminUser = useStore(state => state.setAdminUser)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.currentTarget as HTMLInputElement;
    const { name, value } = target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific field error when user starts typing
    if (error[name]) {
      setError(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Clear global error
    if (globalError) {
      setGlobalError(null);
    }
  };

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError({});
    setGlobalError(null);
    setLoading(true);

    try {
      const response = await axiosInstance.post(`api/auth/admin/login`, formData)
      localStorage.setItem("adminToken", response.data.token)
      toast("Login successful", { className: "text-[15px] px-4 py-2 bg-green" })
      setAdminUser(response.data.userData || response.data.user)
      navigate('/admin/dashboard');

    } catch (error) {
      let responseErrors: Array<{ path: string; message: string }> | undefined;
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ZodErrorResponse>;
        if (axiosError.response?.status === 400 || axiosError.response?.status === 401 || axiosError.response?.status === 404) {
          if (axiosError.response.data.errors) {
            toast(axiosError.response.data.errors[0].message, { className: "text-[15px] px-4 py-2" })
            responseErrors = axiosError.response.data.errors;
          } else {
            toast(axiosError.response.data.message, { className: "text-[15px] px-4 py-2" })
          }
          if (responseErrors) {
            const formErrors = responseErrors.reduce((acc, err) => {
              acc[err.path] = err.message;
              return acc;
            }, {} as Record<string, string>);
            setError(formErrors);
          } else {
            setGlobalError(axiosError.response.data.message || 'Login failed');
          }
        } else {
          setGlobalError("An unexpected error occurred. Please try again.");
        }
      } else {
        setGlobalError("Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
      // setFormData({
      //   email: '',
      //   password: '',
      // })
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
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

        {/* Main Admin Login Card */}
        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Admin Portal
            </CardTitle>
            <CardDescription className="text-gray-600">
              Sign in to the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
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
                    placeholder="Enter your admin email"
                    className="pl-10"
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
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
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
                    className="pl-10"
                    disabled={loading}
                    required
                  />
                </div>
                {error.password && (
                  <p className="text-red-500 text-sm">{error.password}</p>
                )}
              </div>

              {/* Admin Login Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  "Sign in to Admin Portal"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Login
