import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';
import prisma from '../db';

interface AuthenticatedSocket extends Socket {
    userId: number;
    userType: 'user' | 'admin';
    userData: {
        id: number;
        name: string;
        email: string;
    };
}

interface TypingData {
    conversationId: string;
    isTyping: boolean;
}

interface SendMessageData {
    conversationId: string;
    content: string;
    recipientId: number;
    tempId?: string;
}

class ChatService {
    private io: SocketIOServer;
    private connectedUsers = new Map<number, string>(); // userId -> socketId

    constructor(server: HTTPServer) {
        this.io = new SocketIOServer(server, {
            cors: {
                origin: process.env.NODE_ENV === 'production'
                    ? process.env.FRONTEND_URL
                    : ['http://localhost:3000', 'http://localhost:5173'],
                methods: ['GET', 'POST'],
                credentials: true
            },
            path: '/socket.io'
        });

        this.setupSocketHandlers();
    }

    private setupSocketHandlers() {
        this.io.use(async (socket, next) => {
            try {
                const token = socket.handshake.auth.token || socket.handshake.headers.authorization;

                if (!token) {
                    return next(new Error('Authentication token required'));
                }

                const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET as string) as any;
                const user = await prisma.user.findUnique({
                    where: { id: decoded.id },
                    select: { id: true, email: true, name: true }
                });

                if (!user) {
                    return next(new Error('User not found'));
                }

                // Determine if user is admin based on email or role
                const isAdmin = user.email.includes('admin') || user.email === process.env.ADMIN_EMAIL;

                (socket as any).userId = user.id;
                (socket as any).userType = isAdmin ? 'admin' : 'user';
                (socket as any).userData = user;

                next();
            } catch (error) {
                console.error('Socket authentication error:', error);
                next(new Error('Authentication failed'));
            }
        });

        this.io.on('connection', (socket) => {
            this.handleConnection(socket as AuthenticatedSocket);
        });
    }

    private async handleConnection(socket: AuthenticatedSocket) {
        // Store connection
        this.connectedUsers.set(socket.userId, socket.id);

        // Update online status
        await this.updateOnlineStatus(socket.userId, true, socket.id);

        // Join user to their personal room
        socket.join(`user_${socket.userId}`);

        // If admin, join admin room
        if (socket.userType === 'admin') {
            socket.join('admin_room');
        }

        // Send online users list to admins
        this.broadcastOnlineUsers();

        // Handle incoming messages
        socket.on('sendMessage', (data: SendMessageData) => {
            this.handleSendMessage(socket, data);
        });

        // Handle typing indicators
        socket.on('typing', (data: TypingData) => {
            this.handleTyping(socket, data);
        });

        // Handle get conversations
        socket.on('getConversations', () => {
            this.handleGetConversations(socket);
        });

        // Handle get messages for a conversation
        socket.on('getMessages', (conversationId: string) => {
            this.handleGetMessages(socket, conversationId);
        });

        // Handle mark as read
        socket.on('markAsRead', (conversationId: string) => {
            this.handleMarkAsRead(socket, conversationId);
        });

        // Handle disconnect
        socket.on('disconnect', () => {
            this.handleDisconnect(socket);
        });
    }

    private async handleSendMessage(socket: AuthenticatedSocket, data: SendMessageData) {
        try {
            const { conversationId, content, recipientId } = data;

            // Create or get conversation
            let conversation = await prisma.conversation.findUnique({
                where: { id: conversationId }
            });

            if (!conversation) {
                // Create new conversation
                conversation = await prisma.conversation.create({
                    data: {
                        id: conversationId,
                        userId: socket.userType === 'admin' ? recipientId : socket.userId,
                        adminId: socket.userType === 'admin' ? socket.userId : recipientId,
                        lastMessage: content,
                        lastMessageAt: new Date(),
                        unreadCount: 1
                    }
                });
            }

            // Create message
            const message = await prisma.chatMessage.create({
                data: {
                    content,
                    senderId: socket.userId,
                    recipientId,
                    conversationId,
                    messageType: 'TEXT'
                },
                include: {
                    sender: {
                        select: { id: true, name: true, email: true }
                    }
                }
            });

            // Update conversation
            await prisma.conversation.update({
                where: { id: conversationId },
                data: {
                    lastMessage: content,
                    lastMessageAt: new Date(),
                    unreadCount: {
                        increment: 1
                    }
                }
            });

            // Emit to sender (confirmation)
            socket.emit('messageDelivered', {
                tempId: data.tempId,
                message: {
                    id: message.id,
                    content: message.content,
                    senderId: message.senderId,
                    recipientId: message.recipientId,
                    conversationId: message.conversationId,
                    createdAt: message.createdAt,
                    isRead: message.isRead,
                    sender: message.sender
                }
            });

            // Emit to recipient
            const recipientSocketId = this.connectedUsers.get(recipientId);
            if (recipientSocketId) {
                this.io.to(recipientSocketId).emit('newMessage', {
                    id: message.id,
                    content: message.content,
                    senderId: message.senderId,
                    recipientId: message.recipientId,
                    conversationId: message.conversationId,
                    createdAt: message.createdAt,
                    isRead: message.isRead,
                    sender: message.sender
                });
            }

            // Update conversations list for both users
            this.updateConversationsList(conversation.userId);
            this.updateConversationsList(conversation.adminId);

        } catch (error) {
            console.error('Error sending message:', error);
            socket.emit('messageError', { error: 'Failed to send message' });
        }
    }

    private handleTyping(socket: AuthenticatedSocket, data: TypingData) {
        const { conversationId, isTyping } = data;

        // Broadcast typing status to other users in the conversation
        socket.to(conversationId).emit('userTyping', {
            userId: socket.userId,
            userName: socket.userData.name,
            isTyping,
            conversationId
        });
    }

    private async handleGetConversations(socket: AuthenticatedSocket) {
        try {
            const conversations = await prisma.conversation.findMany({
                where: socket.userType === 'admin'
                    ? { adminId: socket.userId }
                    : { userId: socket.userId },
                include: {
                    user: {
                        select: { id: true, name: true, email: true }
                    },
                    admin: {
                        select: { id: true, name: true, email: true }
                    },
                    messages: {
                        take: 1,
                        orderBy: { createdAt: 'desc' },
                        include: {
                            sender: {
                                select: { id: true, name: true }
                            }
                        }
                    }
                },
                orderBy: {
                    lastMessageAt: 'desc'
                }
            });

            socket.emit('conversationsList', conversations);
        } catch (error) {
            console.error('Error getting conversations:', error);
            socket.emit('conversationsError', { error: 'Failed to get conversations' });
        }
    }

    private async handleGetMessages(socket: AuthenticatedSocket, conversationId: string) {
        try {
            const messages = await prisma.chatMessage.findMany({
                where: { conversationId },
                include: {
                    sender: {
                        select: { id: true, name: true, email: true }
                    }
                },
                orderBy: { createdAt: 'asc' }
            });

            socket.emit('messagesHistory', { conversationId, messages });
        } catch (error) {
            console.error('Error getting messages:', error);
            socket.emit('messagesError', { error: 'Failed to get messages' });
        }
    }

    private async handleMarkAsRead(socket: AuthenticatedSocket, conversationId: string) {
        try {
            await prisma.chatMessage.updateMany({
                where: {
                    conversationId,
                    recipientId: socket.userId,
                    isRead: false
                },
                data: {
                    isRead: true
                }
            });

            // Reset unread count for this user
            await prisma.conversation.update({
                where: { id: conversationId },
                data: { unreadCount: 0 }
            });

            socket.emit('messagesRead', { conversationId });
        } catch (error) {
            console.error('Error marking messages as read:', error);
        }
    }

    private async handleDisconnect(socket: AuthenticatedSocket) {
        // Remove from connected users
        this.connectedUsers.delete(socket.userId);

        // Update online status
        await this.updateOnlineStatus(socket.userId, false);

        // Broadcast updated online users list
        this.broadcastOnlineUsers();
    }

    private async updateOnlineStatus(userId: number, isOnline: boolean, socketId?: string) {
        try {
            await prisma.onlineStatus.upsert({
                where: { userId },
                update: {
                    isOnline,
                    lastSeen: new Date(),
                    socketId: isOnline ? socketId : null
                },
                create: {
                    userId,
                    isOnline,
                    lastSeen: new Date(),
                    socketId: isOnline ? socketId : null
                }
            });
        } catch (error) {
            console.error('Error updating online status:', error);
        }
    }

    private async broadcastOnlineUsers() {
        try {
            const onlineUsers = await prisma.onlineStatus.findMany({
                where: { isOnline: true },
                include: {
                    user: {
                        select: { id: true, name: true, email: true }
                    }
                }
            });

            // Broadcast to all admin sockets
            this.io.to('admin_room').emit('onlineUsers', onlineUsers);
        } catch (error) {
            console.error('Error broadcasting online users:', error);
        }
    }

    private async updateConversationsList(userId: number) {
        try {
            const socketId = this.connectedUsers.get(userId);
            if (socketId) {
                const conversations = await prisma.conversation.findMany({
                    where: {
                        OR: [
                            { userId },
                            { adminId: userId }
                        ]
                    },
                    include: {
                        user: {
                            select: { id: true, name: true, email: true }
                        },
                        admin: {
                            select: { id: true, name: true, email: true }
                        }
                    },
                    orderBy: {
                        lastMessageAt: 'desc'
                    }
                });

                this.io.to(socketId).emit('conversationsUpdated', conversations);
            }
        } catch (error) {
            console.error('Error updating conversations list:', error);
        }
    }

    // Public method to get online users (for REST API)
    public async getOnlineUsers() {
        return await prisma.onlineStatus.findMany({
            where: { isOnline: true },
            include: {
                user: {
                    select: { id: true, name: true, email: true }
                }
            }
        });
    }

    // Public method to get all users (for admin)
    public async getAllUsers() {
        return await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                onlineStatus: true
            },
            orderBy: {
                name: 'asc'
            }
        });
    }
}

export default ChatService;
