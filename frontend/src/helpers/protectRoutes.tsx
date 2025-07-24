import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import SimpleSpinner from '../components/SimpleSpinner';
import Cookies from 'js-cookie';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string || "http://localhost:3001";

const PublicRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false); // Start with false for faster loading
    const location = useLocation();
    const navigate = useNavigate()

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // First check if tokens exist locally - much faster
                const token = Cookies.get('token') || localStorage.getItem('token');
                const isLoggedIn = localStorage.getItem('isLoggedIn');

                if (!token || isLoggedIn !== 'yes') {
                    // No token found, user is not authenticated
                    setLoading(false);
                    return;
                }

                // Only make API call if we have a token
                setLoading(true);
                const response = await axios.post(`${apiBaseUrl}/api/validate`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    timeout: 5000 // 5 second timeout to prevent hanging
                });

                if (response.data.isAuthenticated) {
                    setIsAuthenticated(true);
                    navigate('/dashboard');
                }
            } catch (error) {
                // Clean up tokens on validation failure
                Cookies.remove('token');
                localStorage.removeItem('token');
                localStorage.removeItem('isLoggedIn');
                console.log('Token validation failed:', error.message);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [navigate]);

    if (loading) {
        return <SimpleSpinner />; // Fast loading component
    }

    if (isAuthenticated) {
        // Redirect to dashboard if user is authenticated
        navigate('/dashboard');
    }

    return children;
};

export default PublicRoute;