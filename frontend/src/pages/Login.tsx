import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { logo } from "../assets/icons";
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from "sonner"
import axios, { AxiosError } from 'axios';
import React from "react";
import { useStore } from "../store/useStore";

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
  const [successMessage, setSuccessMessage] = useState("");
  
  const setUser = useStore(state => state.setUser)
  const navigate = useNavigate();

  // Add useEffect to check for existing token and validate
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    const validateToken = async () => {
      if (token) {
        try {
          // Add your token validation endpoint here
          const response = await axios.post("http://localhost:3001/token/validate", {
            headers: {
              'Authorization': "Bearer " + localStorage.getItem("token")
            }
          });
          console.log(response.data)
          if (response.data.valid) {
            // If token is valid, automatically redirect to dashboard
            toast.success("Already logged in", {className:"text-[15px] px-4 py-2"});
            navigate('/dashboard');
          }
        } catch (error) {
          // If token validation fails, remove the token
          localStorage.removeItem("token");
        }
      }
    };

    validateToken();
  }, [navigate]);

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

  const goHome = () => {
    navigate('/')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError({});
    setGlobalError(null);
    setLoading(true);
    setSuccessMessage("");
    
    try {
      const response = await axios.post("http://localhost:3001/api/auth/signin", formData)
      console.log(response.data)
      toast.success("Login successful", {className:"text-[15px] px-4 py-2"})
      setUser(response.data.user)
      localStorage.setItem("userId", response.data.user.id)
      localStorage.setItem("token", response.data.token)
      navigate('/dashboard');

    } catch (error) {
      let errorMessage = "Login failed";
      
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ZodErrorResponse>;
        
        if (axiosError.response?.status === 400 || axiosError.response?.status === 401 || axiosError.response?.status === 404) {
          if (axiosError.response.data.errors) {
            errorMessage = axiosError.response.data.errors[0].message;
            
            // Optionally, handle field-specific errors
            const formErrors = axiosError.response.data.errors.reduce((acc, err) => {
              acc[err.path] = err.message;
              return acc;
            }, {} as Record<string, string>);
            
            setError(formErrors);
          } else if (axiosError.response.data.message) {
            errorMessage = axiosError.response.data.message;
          }
        } else {
          errorMessage = "An unexpected error occurred. Please try again.";
        }
      } else {
        errorMessage = "Network error. Please check your connection.";
      }
      
      // Use toast for error message instead of setting global error
      toast.error(errorMessage, {className:"text-[15px] font-semibold px-4 py-2"});
      
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative text-white flex justify-center items-center min-h-screen p-4 flex-col">
      <a href="" onClick={goHome}>
        <div className="mb-2 flex items-center">
          <img src={logo} alt="logo" width={50} height={10}/>
          <p className='text-[30px] text-white leading-8'>Block<span className="text-orange-500">Fundz</span></p>
        </div>
      </a>
      <div className="relative backdrop-blur-lg bg-white/5 p-8 rounded-2xl shadow-xl border border-white/10 w-full max-w-md">
        <form action="" className="space-y-6 " onSubmit={handleSubmit}>
          <div className="space-y-8 ">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
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
                name="email"
                value={formData.email}
                type="email"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-11 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Enter your email" 
                onChange={handleChange}
              />
              {error.email && (
                <p className="text-red-500 text-sm mt-1">{error.email}</p>
              )}
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
                type="password"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-11 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
              {error.password && (
                <p className="text-red-500 text-sm mt-1">{error.password}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2 text-white/80">
              <input type="checkbox" className="rounded border-white/20 bg-white/5" />
              <span>Remember me</span>
            </label>
            <button type="button" className="text-white/80 hover:text-white">
              Forgot password?
            </button>
          </div>

          <button
              type="submit"
              disabled={loading}
              className="w-full bg-white/10 text-white rounded-lg py-3 font-medium hover:bg-white/20 transition-all duration-300 border border-white/10"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-white/60">
              Don't have an account?{' '}
              <Link to="/signup">
                <a href="#" className="hover:underline text-orange-500">
                  Sign up
                </a>
              </Link>
            </p>
        </form>
      </div>
    </main>
  )
}

export default Login