import { useEffect } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

export default function useNotificationSocket(onNotification: (notif: any) => void) {
    useEffect(() => {
        const socket = io(SOCKET_URL); // No custom path, uses default /socket.io/
        socket.on('new-notification', onNotification);
        return () => {
            socket.disconnect();
        };
    }, [onNotification]);
}
