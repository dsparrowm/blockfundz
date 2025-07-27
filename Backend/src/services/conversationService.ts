import prisma from '../db'
import redisClient from '../lib/redisClient';

export const conversationService = {
    async getConversations(adminId: string) {
        const cacheKey = `admin:${adminId}:conversations`;
        const cached = await redisClient.get(cacheKey);

        if (cached) {
            return JSON.parse(cached);
        }

        const conversations = await prisma.conversation.findMany({
            where: { user: { id: { not: Number(adminId) } } },
            include: {
                user: { select: { id: true, email: true, name: true, } },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 50,
                },
            },
        });

        const formattedConversations = conversations.map((conv) => ({
            ...conv,
            user: {
                id: conv.user.id,
                name: `${conv.user.name}`,
                email: conv.user.email,
            },
        }));

        await redisClient.set(cacheKey, JSON.stringify(formattedConversations), 'EX', 300);
        return formattedConversations;
    },

    async getConversationByUser(adminId: number, userId: number) {
        const conversation = await prisma.conversation.findFirst({
            where: { userId, user: { id: { not: adminId } } },
            include: {
                user: { select: { id: true, email: true, name: true, } },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 50,
                },
            },
        });

        if (!conversation) return null;

        return {
            ...conversation,
            user: {
                id: conversation.user.id,
                name: `${conversation.user.name}}`,
                email: conversation.user.email,
            },
        };
    },

    async createConversation(adminId: number, userId: number) {
        const conversation = await prisma.conversation.create({
            data: {
                user: { connect: { id: userId } },
                admin: { connect: { id: adminId } },
            },
            include: {
                user: { select: { id: true, email: true, name: true, } },
                messages: { orderBy: { createdAt: 'desc' }, take: 50 },
            },
        });

        await redisClient.del(`admin:${adminId}:conversations`);
        return {
            ...conversation,
            user: {
                id: conversation.user.id,
                name: `${conversation.user.name}`,
                email: conversation.user.email,
            },
        };
    },

    async createMessage(adminId: number, conversationId: number, content: string, senderId: number) {
        const message = await prisma.chatMessage.create({
            data: {
                content,
                sender: { connect: { id: senderId } },
                recipient: { connect: { id: adminId } }, // Add this line
                conversation: { connect: { id: conversationId.toString() } },
                isRead: senderId === adminId,
            },
            include: { sender: { select: { id: true, name: true } } },
        });

        await prisma.conversation.update({
            where: { id: conversationId.toString() },
            data: {
                lastMessage: content,
                lastMessageAt: new Date(),
                unreadCount: senderId === adminId ? 0 : { increment: 1 },
            },
        });

        await redisClient.del(`admin:${adminId}:conversations`);
        return message;
    },

    async markMessagesRead(conversationId: string, userId: string) {
        await prisma.chatMessage.updateMany({
            where: { conversationId, senderId: { not: Number(userId) }, isRead: false },
            data: { isRead: true },
        });

        await prisma.conversation.update({
            where: { id: conversationId },
            data: { unreadCount: 0 },
        });
    },
};