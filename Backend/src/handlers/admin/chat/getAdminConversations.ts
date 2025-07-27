import { Request, Response } from 'express';
import prisma from '../../../db';


const getAdminConversations = async (req: Request, res: Response) => {
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@mail.com';
    try {
        console.log('🔍 Conversations endpoint - req.user testing again:', req.user);
        const admin = await prisma.user.findFirst({ where: { email: ADMIN_EMAIL } });
        console.log('🔍 Conversations endpoint - admin found:', admin ? { id: admin.id, email: admin.email } : 'not found');
        console.log('🔍 Conversations endpoint - ADMIN_EMAIL:', ADMIN_EMAIL);

        if (!admin) {
            console.log('❌ Admin check failed - admin.id:', admin?.id, 'req.user.id:', req.user.id);
            return res.status(403).json({ error: 'Unauthorized: Admin access required' });
        }

        const conversations = await prisma.conversation.findMany({
            where: { adminId: admin.id },
            include: {
                user: { select: { id: true, name: true, email: true } },
                messages: {
                    orderBy: { createdAt: 'asc' },
                    take: 10
                }
            }
        });
        res.json(conversations.map(conv => ({
            id: conv.id,
            userId: conv.userId,
            user: conv.user,
            lastMessage: conv.lastMessage,
            lastMessageAt: conv.lastMessageAt,
            unreadCount: conv.unreadCount,
            messages: conv.messages
        })));
    } catch (err) {
        console.error('❌ Error fetching conversations:', err);
        res.status(500).json({ error: 'Failed to fetch conversations' });
    }
}

export default getAdminConversations;