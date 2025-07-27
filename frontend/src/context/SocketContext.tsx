import { createContext, useContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { toast } from 'sonner';

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children, userId, token }) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if (!userId || !token) return;

        const parsedUserId = parseInt(userId, 10);
        const newSocket = io('http://localhost:3001', {
            path: '/chat-socket.io',
            auth: { token }
        });

        newSocket.on('connect', () => {
            newSocket.emit('userConnected', { userId: parsedUserId, token });
        });

        newSocket.on('connect_error', (err) => {
            console.error('Socket.IO connection error:', err);
            // Only show toast if user is actually trying to use chat features
            // toast.error('Failed to connect to chat server');
        });

        newSocket.on('connection-error', ({ error }) => {
            console.error('Socket.IO authentication error:', error);
            // Only show toast if user is actually trying to use chat features
            // toast.error(error);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [userId, token]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);