import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { logo } from "../assets/icons";
import { Link } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import React from "react";
import { toast } from "sonner";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string || "http://localhost:3001";


const Register = () => {
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [error, setError] = useState<Record<string, string>>({});
  const [phone, setPhone] = useState('');
  const [formValues, setFormValues] = useState<FormValues>({
    name: '',
    email: '',
    password: '',
    phone: ''
  });


  const navigate = useNavigate();

  interface InputChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

  const handleInputChange = (e: InputChangeEvent) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      phone: phone,
      [name]: value
    });

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
  }

  interface FormValues {
    name: string;
    email: string;
    password: string;
    phone: string;
  }

  interface ZodErrorResponse {
    errors: Array<{ path: string; message: string }>;
    message: string;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiBaseUrl}/api/auth/signup`, formValues);
      if (response.status === 200) {
        toast.success(response.data.message || 'Account created successfully');
        navigate('/login');
      }
    } catch (error) {
      let responseErrors: Array<{ path: string; message: string }> | undefined;
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ZodErrorResponse>;
        if (axiosError.response?.status === 400 || axiosError.response?.status === 401) {
          if (axiosError.response?.data.errors) {
            console.log("This is the error from the server: ", axiosError.response.data.errors[0].message);
            toast.error(axiosError.response.data.errors[0].message, {className:"text-[15px] px-4 py-2"})
            responseErrors = axiosError.response.data.errors;
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
    }
  };

  return (
    <main className="relative text-white flex justify-center items-center min-h-screen p-4 flex-col">
      <a href="" onClick={() => navigate('/')}>
        <div className="mb-2 flex items-center">
          <img src={logo} alt="logo" width={50} height={10}/>
          <p className='text-[30px] text-white leading-8'>Block<span className="text-orange-500">Fundz</span></p>
        </div>
      </a>
      <div className="relative backdrop-blur-lg bg-white/5 p-8 rounded-2xl shadow-xl border border-white/10 w-full max-w-md">
        <form action="" className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-8 ">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                <p className="text-white/60">Sign up to get started</p>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-white/80 text-sm font-medium pl-1">Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center">
                <FaUser className="h-5 w-5 text-white/40" />
              </div>
              <input type="text" onChange={handleInputChange} name="name" className="w-full bg-white/5 border border-white/10 rounded-lg px-11 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20" placeholder="Full Name" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-white/80 text-sm font-medium pl-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center">
                <FaUser className="h-5 w-5 text-white/40" />
              </div>
              <input type="email" name="email" onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-11 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20" placeholder="Enter your email" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-white/80 text-sm font-medium pl-1">Phone</label>
            <div className="relative">
              <PhoneInput
                country="us"
                placeholder="Enter phone number"
                countryCodeEditable={false}
                inputStyle={{
                  width: '100%',
                  height: '50px',
                  fontSize: '18px',
                  borderRadius: '0.375rem',
                  border: 'none',
                  fontWeight: 500,
                  outline: 'none',
                  color: '#FFFFFF',
                  backgroundColor: 'rgb(255 255 255 / 0.05)',
                  paddingLeft: '3rem'
                }}
                containerStyle={{
                  width: '100%',
                  backgroundColor: 'rgb(255 255 255 / 0.05)',
                  border: '1px solid #1A1A1A',
                  boxShadow: '0 0 4px #191919',
                  height: '50px',
                  borderRadius: '8px',
                  marginBottom: '16px'
                }}
                buttonStyle={{
                  backgroundColor: 'rgb(255 255 255 / 0.05)',
                  border: 'none',
                }}
                dropdownStyle={{
                  backgroundColor: '#262626',
                  color: '#666666',
                  border: '1px solid #1A1A1A',
                  boxShadow: '0 0 4px #191919',
                }}
                value={phone}
                onChange={setPhone}
              />
              
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
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-11 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
              type="submit"
              className="w-full bg-white/10 text-white rounded-lg py-3 font-medium hover:bg-white/20 transition-all duration-300 border border-white/10"
            >
              Sign up
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-white/60">
              Already have an account?{' '}
              <Link to="/login" className="hover:underline text-orange-500">
                Sign in
              </Link>
             
            </p>
        </form>
      </div>
    </main>
  )
}

export default Register