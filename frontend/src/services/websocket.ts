import { io, Socket } from 'socket.io-client';

export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'admin';
    senderId: string;
    receiverId: string;
    conversationId: string;
    timestamp: Date;
    status: 'sent' | 'delivered' | 'read';
    messageType: 'text' | 'image' | 'file';
    isRead?: boolean;
    metadata?: {
        fileName?: string;
        fileSize?: number;
        fileUrl?: string;
    };
}

export interface ChatUser {
    id: string;
    username: string;
    email: string;
    avatar?: string;
    isOnline: boolean;
    lastSeen?: Date;
    role: 'user' | 'admin';
}

export interface TypingIndicator {
    userId: string;
    isTyping: boolean;
    timestamp: Date;
}

class WebSocketService {
    private socket: Socket | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 1000;

    connect(userId: string, userRole: 'user' | 'admin'): Promise<Socket> {
        return new Promise((resolve, reject) => {
            try {
                const wsUrl = (import.meta as any).env?.VITE_WS_URL || 'ws://localhost:3001';

                this.socket = io(wsUrl, {
                    auth: {
                        userId,
                        userRole,
                        token: localStorage.getItem('token') || ''
                    },
                    transports: ['websocket', 'polling'],
                    timeout: 20000,
                    forceNew: true
                });

                this.socket.on('connect', () => {
                    console.log('WebSocket connected');
                    this.reconnectAttempts = 0;
                    resolve(this.socket!);
                });

                this.socket.on('connect_error', (error) => {
                    console.error('WebSocket connection error:', error);
                    this.handleReconnect();
                    reject(error);
                });

                this.socket.on('disconnect', (reason) => {
                    console.log('WebSocket disconnected:', reason);
                    if (reason === 'io server disconnect') {
                        // Server disconnected, try to reconnect
                        this.handleReconnect();
                    }
                });

                // Set up event handlers
                this.setupEventHandlers();

            } catch (error) {
                console.error('Failed to create WebSocket connection:', error);
                reject(error);
            }
        });
    }

    private handleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

            setTimeout(() => {
                this.socket?.connect();
            }, this.reconnectDelay * this.reconnectAttempts);
        } else {
            console.error('Max reconnection attempts reached');
        }
    }

    private setupEventHandlers() {
        if (!this.socket) return;

        this.socket.on('error', (error) => {
            console.error('WebSocket error:', error);
        });

        this.socket.on('user_status_changed', (data) => {
            // Handle user online/offline status changes
            console.log('User status changed:', data);
        });
    }

    // Message operations
    sendMessage(message: ChatMessage): void {
        if (!this.socket?.connected) {
            throw new Error('WebSocket not connected');
        }
        this.socket.emit('send_message', message);
    }

    markAsRead(messageIds: string[], userId: string): void {
        if (!this.socket?.connected) return;

        this.socket.emit('mark_as_read', { messageIds, userId });
    }

    // Typing indicators
    startTyping(conversationId: string): void {
        if (!this.socket?.connected) return;
        this.socket.emit('typing_start', { conversationId });
    }

    stopTyping(conversationId: string): void {
        if (!this.socket?.connected) return;
        this.socket.emit('typing_stop', { conversationId });
    }

    // Event listeners
    onMessage(callback: (message: ChatMessage) => void): void {
        this.socket?.on('message_received', callback);
    }

    onMessageUpdate(callback: (message: ChatMessage) => void): void {
        this.socket?.on('message_updated', callback);
    }

    onMessageDelete(callback: (messageId: string) => void): void {
        this.socket?.on('message_deleted', callback);
    }

    onTypingStart(callback: (data: { userId: string; username: string; conversationId: string }) => void): void {
        this.socket?.on('typing_start', callback);
    }

    onTypingStop(callback: (data: { userId: string; conversationId: string }) => void): void {
        this.socket?.on('typing_stop', callback);
    }

    onUserOnline(callback: (userId: string) => void): void {
        this.socket?.on('user_online', callback);
    }

    onUserOffline(callback: (userId: string) => void): void {
        this.socket?.on('user_offline', callback);
    }

    onConnect(callback: () => void): void {
        this.socket?.on('connect', callback);
    }

    onDisconnect(callback: () => void): void {
        this.socket?.on('disconnect', callback);
    }

    onError(callback: (error: string) => void): void {
        this.socket?.on('error', callback);
    }

    removeAllListeners(): void {
        this.socket?.removeAllListeners();
    }

    deleteMessage(messageId: string): void {
        if (!this.socket?.connected) return;
        this.socket.emit('delete_message', { messageId });
    }

    // File upload
    uploadFile(file: File, conversationId: string, progressCallback?: (progress: number) => void): Promise<string> {
        return new Promise((resolve, reject) => {
            if (!this.socket?.connected) {
                reject(new Error('WebSocket not connected'));
                return;
            }

            const formData = new FormData();
            formData.append('file', file);
            formData.append('conversationId', conversationId);

            // Use traditional HTTP upload for files
            const uploadUrl = `${(import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3001'}/api/chat/upload`;

            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable && progressCallback) {
                    const progress = (e.loaded / e.total) * 100;
                    progressCallback(progress);
                }
            });

            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        resolve(response.fileUrl);
                    } catch (error) {
                        reject(new Error('Invalid response from server'));
                    }
                } else {
                    reject(new Error(`Upload failed with status ${xhr.status}`));
                }
            });

            xhr.addEventListener('error', () => {
                reject(new Error('Upload failed'));
            });

            xhr.open('POST', uploadUrl);
            xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token')}`);
            xhr.send(formData);
        });
    }

    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    isConnected(): boolean {
        return this.socket?.connected || false;
    }

    getSocket(): Socket | null {
        return this.socket;
    }
}

export const webSocketService = new WebSocketService();
export default webSocketService;
