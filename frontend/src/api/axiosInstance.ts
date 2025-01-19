import axios from 'axios';
import Cookies from 'js-cookie';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const axiosInstance = axios.create({
    baseURL: apiBaseUrl,
    withCredentials: true,
});

// Request interceptor to add the token to headers
axiosInstance.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle token expiration or other errors
        if (error.response && error.response.status === 401) {
            // Redirect to login or refresh token
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;