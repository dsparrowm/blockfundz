import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string || "http://localhost:3001";

const PublicRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate()

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setLoading(false);
                    return;
                }

                const response = await axios.post(`${apiBaseUrl}/token/validate`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },

                });

                if (response.data.isAuthenticated) {
                    setIsAuthenticated(true);
                }
            } catch (error) {
                localStorage.removeItem('token');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Or your loading component
    }

    if (isAuthenticated) {
        // Redirect to dashboard if user is authenticated
        navigate('/dashboard');
    }

    return children;
};

export default PublicRoute;