import React from "react";
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { crypto_logo } from "../assets/icons";
import { useState } from 'react';
import { useStore } from "../store/useStore";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/spinners/Spinner";


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

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string || "http://localhost:3001";


const Login = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [error, setError] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
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
    setSuccessMessage("");

    try {
      const response = await axios.post(`${apiBaseUrl}/api/auth/admin/login`, formData)
      localStorage.setItem("adminToken", response.data.token)
      toast("Login successful", { className: "text-[15px] px-4 py-2 bg-green" })
      setAdminUser(response.data.user)
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
          } else {
            setGlobalError(axiosError.response.data.message || 'Login failed');
          }
        } else {
          setGlobalError("An unexpected error occurred. Please try again.");
        }
      } else {
        setGlobalError("Network error. Please check your connection.");
      }
      console.log(error)
    } finally {
      setLoading(false);
      // setFormData({
      //   email: '',
      //   password: '',
      // })
    }
  };

  return (
    <main className="relative text-white flex justify-center items-center min-h-screen p-4 flex-col bg-black">
      <div className="flex items-center justify-center space-x-3 mb-5 cursor-pointer" onClick={() => navigate('/')}>

        {crypto_logo ? (
          <img src={crypto_logo} alt="NexGen Logo" className="w-8 h-8 " />
        ) : (
          <Bitcoin className="w-6 h-6 text-white" />
        )}
        <span className="text-3xl text-white font-bold">
          Nex<span className="text-crypto-blue">Gen</span>
        </span>
      </div>
      <div className="relative backdrop-blur-lg bg-dark-blue/80 p-8 rounded-2xl shadow-xl border border-white/10 w-full max-w-md">
        <form action="" className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-8 ">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-2">Admin Login</h1>
              <p className="text-white/60">Sign in to your account</p>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-white/80 text-sm font-medium pl-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center">
                <FaUser className="h-5 w-5 text-white/40" />
              </div>
              <input
                onChange={handleChange}
                value={formData.email}
                type="email"
                name="email"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-11 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Enter your email" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-white/80 text-sm font-medium pl-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center">
                <FaLock className="h-5 w-5 text-white/40 " />
              </div>
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-11 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {/* <div className="flex items-center justify-between text-sm bg-transparent">
            <label className="flex items-center space-x-2 text-white/80">
              <input type="checkbox" className="rounded border-white/20 bg-white/5" />
              <span className="bg-transparent">Remember me</span>
            </label>
            <button type="button" className="text-white/80 hover:text-white">
              Forgot password?
            </button>
          </div> */}

          <button
            type="submit"
            className="w-full bg-orange-500 text-white rounded-lg py-3 font-medium hover:bg-white/20 transition-all duration-300 border border-white/10"
          >
            {loading ? (<Spinner />) : "Sign In"}
          </button>

          {/* Sign Up Link */}
          {/* <p className="text-center text-white/60 bg-transparent">
              Don't have an account?{' '}
              <Link to="/signup">
                <a href="#" className="hover:underline text-orange-500">
                  Sign up
                </a>
              </Link>
            </p> */}
        </form>
      </div>
    </main>
  )
}

export default Login
