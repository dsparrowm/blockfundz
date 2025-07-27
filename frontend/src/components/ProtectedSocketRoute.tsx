import React from 'react';
import { SocketProvider } from '../context/SocketContext';
import { useStore } from '../store/useStore';
import Cookies from 'js-cookie';

interface ProtectedSocketRouteProps {
    children: React.ReactNode;
}

const ProtectedSocketRoute: React.FC<ProtectedSocketRouteProps> = ({ children }) => {
    const { user } = useStore();
    const token = Cookies.get('token') || localStorage.getItem('adminToken');
    const isAuthenticated = user && token;

    if (isAuthenticated) {
        return (
            <SocketProvider userId={user?.id?.toString()} token={token}>
                {children}
            </SocketProvider>
        );
    }

    return <>{children}</>;
};

export default ProtectedSocketRoute;
