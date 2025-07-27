import dotenv from 'dotenv';
dotenv.config();
import app from './server';
import http from 'http';
import { initSocket, io } from './socket';
import prisma from './db';
import jwt from 'jsonwebtoken';
import authMiddleware from './middleware/authMiddleware';
import editTransaction from './handlers/transactions/editTransactions';
import { InterestCalculationService } from './services/InterestCalculationService';

const server = http.createServer(app);
initSocket(server); // No custom path, uses default /socket.io/

const JWT_SECRET = process.env.JWT_SECRET || 'cookies';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@mail.com';

io.on('connection', (socket) => {
    console.log(`🔗 Socket.IO: User connected with socket ID: ${socket.id}`);

    socket.on('userConnected', async ({ userId, token }) => {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            const parsedUserId = parseInt(userId, 10);
            if (decoded.id !== parsedUserId) {
                socket.emit('connection-error', { error: 'Invalid user authentication' });
                return;
            }

            // Update OnlineStatus
            await prisma.onlineStatus.upsert({
                where: { userId: parsedUserId },
                update: {
                    isOnline: true,
                    socketId: socket.id,
                    lastSeen: new Date()
                },
                create: {
                    userId: parsedUserId,
                    isOnline: true,
                    socketId: socket.id,
                    lastSeen: new Date()
                }
            });

            console.log(`👤 User registered: userId=${parsedUserId}, socketId=${socket.id}`);
        } catch (err) {
            console.error('❌ Authentication error:', err);
            socket.emit('connection-error', { error: 'Authentication failed' });
        }
    });

    socket.on('private-message', async (data) => {
        console.log(`📨 Received private-message from socket ${socket.id}`);
        try {
            if (!data.content || !data.senderId || !data.recipientId) {
                socket.emit('message-error', { error: 'Missing required fields' });
                return;
            }

            const senderId = parseInt(data.senderId, 10);
            const recipientId = parseInt(data.recipientId, 10);
            const admin = await prisma.user.findFirst({ where: { email: ADMIN_EMAIL } });
            if (!admin) {
                socket.emit('message-error', { error: 'Admin not found' });
                return;
            }

            // Restrict users to message only admin
            if (senderId !== admin.id && recipientId !== admin.id) {
                socket.emit('message-error', { error: 'Users can only message admins' });
                return;
            }

            const result = await prisma.$transaction(async (prisma) => {
                let conversation = await prisma.conversation.findFirst({
                    where: {
                        OR: [
                            { userId: senderId, adminId: recipientId },
                            { userId: recipientId, adminId: senderId }
                        ]
                    }
                });

                if (!conversation) {
                    conversation = await prisma.conversation.create({
                        data: {
                            userId: senderId === admin.id ? recipientId : senderId,
                            adminId: senderId === admin.id ? senderId : recipientId,
                            lastMessage: data.content,
                            lastMessageAt: new Date(),
                            unreadCount: senderId === admin.id ? 0 : 1
                        }
                    });
                    console.log(`✅ Created new conversation: ${conversation.id}`);
                }

                const savedMessage = await prisma.chatMessage.create({
                    data: {
                        content: data.content,
                        senderId,
                        recipientId,
                        conversationId: conversation.id,
                        messageType: 'TEXT'
                    }
                });

                const response = await prisma.chatMessage.findUnique({
                    where: { id: savedMessage.id },
                    include: {
                        sender: { select: { id: true, name: true, email: true } },
                        recipient: { select: { id: true, name: true, email: true } }
                    }
                });

                await prisma.conversation.update({
                    where: { id: conversation.id },
                    data: {
                        lastMessage: data.content,
                        lastMessageAt: new Date(),
                        unreadCount: senderId === admin.id ? 0 : { increment: 1 }
                    }
                });

                const message = {
                    id: response.id,
                    content: response.content,
                    senderId: response.senderId,
                    recipientId: response.recipientId,
                    conversationId: response.conversationId,
                    isRead: response.isRead,
                    messageType: response.messageType,
                    createdAt: response.createdAt,
                    sender: response.sender,
                    recipient: response.recipient
                };

                const recipientStatus = await prisma.onlineStatus.findUnique({
                    where: { userId: recipientId }
                });

                socket.emit('private-message', message);
                if (recipientStatus?.socketId && recipientStatus.socketId !== socket.id) {
                    socket.broadcast.to(recipientStatus.socketId).emit('private-message', message);
                }

                return message;
            });
        } catch (err) {
            console.error('❌ Error in private-message:', err);
            socket.emit('message-error', { error: 'Failed to send message', details: err.message });
        }
    });

    socket.on('typing', async (data) => {
        const recipientStatus = await prisma.onlineStatus.findUnique({
            where: { userId: parseInt(data.recipientId, 10) }
        });
        if (recipientStatus?.socketId) {
            socket.broadcast.to(recipientStatus.socketId).emit('typing', {
                senderId: parseInt(data.senderId, 10),
                conversationId: data.conversationId,
                isTyping: data.isTyping
            });
        }
    });

    socket.on('mark-messages-read', async (data) => {
        try {
            const senderId = parseInt(data.senderId, 10);
            const userId = parseInt(data.userId, 10);
            const conversation = await prisma.conversation.findUnique({
                where: { id: data.conversationId },
                include: { user: true, admin: true } // Updated to include user and admin relations
            });
            if (!conversation || (conversation.userId !== senderId && conversation.adminId !== senderId)) {
                socket.emit('error', { error: 'Invalid sender for conversation' });
                return;
            }

            await prisma.chatMessage.updateMany({
                where: {
                    conversationId: data.conversationId,
                    recipientId: userId,
                    isRead: false
                },
                data: { isRead: true }
            });

            await prisma.conversation.update({
                where: { id: data.conversationId },
                data: { unreadCount: 0 }
            });

            const senderStatus = await prisma.onlineStatus.findUnique({
                where: { userId: senderId }
            });
            if (senderStatus?.socketId) {
                socket.broadcast.to(senderStatus.socketId).emit('messages-read', {
                    conversationId: data.conversationId,
                    readBy: userId
                });
            }
        } catch (err) {
            console.error('❌ Error marking messages as read:', err);
            socket.emit('error', { error: 'Failed to mark messages as read' });
        }
    });

    socket.on('disconnect', async () => {
        console.log(`❌ Socket.IO: User disconnected - socket ID: ${socket.id}`);
        await prisma.onlineStatus.updateMany({
            where: { socketId: socket.id },
            data: { isOnline: false, lastSeen: new Date() }
        });
    });
});

app.get('/api/users', authMiddleware, async (req, res) => {
    try {
        const admin = await prisma.user.findFirst({ where: { email: ADMIN_EMAIL } });
        if (!admin || req.user.id !== admin.id) {
            return res.status(403).json({ error: 'Unauthorized: Admin access required' });
        }
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true }
        });
        res.json(users);
    } catch (err) {
        console.error('❌ Error fetching users:', err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

app.get('/api/online-status', authMiddleware, async (req, res) => {
    try {
        const admin = await prisma.user.findFirst({ where: { email: ADMIN_EMAIL } });
        if (!admin) {
            return res.status(403).json({ error: 'Unauthorized: Admin access required' });
        }
        const { userIds } = req.query;
        // For now, return all users as offline since we don't have online status tracking
        // You can implement real-time online status tracking later
        const statuses = Array.isArray(userIds) ? userIds.map(id => ({ userId: parseInt(id as string), isOnline: false })) : [];
        res.json(statuses);
    } catch (err) {
        console.error('❌ Error fetching online status:', err);
        res.status(500).json({ error: 'Failed to fetch online status' });
    }
});

app.put('/api/transactions/:id', editTransaction);

// Start the interest calculation scheduler
InterestCalculationService.startInterestCalculationScheduler();

server.listen(3001, () => {
    console.log('server running on http://localhost:3001');
});