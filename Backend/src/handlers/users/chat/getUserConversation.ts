import { Request, Response } from 'express';
import prisma from '../../../db';

const getUserConversation = async (req: Request, res: Response) => {
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@mail.com';
    try {
        let conversation = await prisma.conversation.findFirst({
            where: { userId: req.user.id },
            include: { messages: { orderBy: { createdAt: 'asc' }, take: 10 } }
        });
        if (!conversation) {
            const admin = await prisma.user.findFirst({ where: { email: ADMIN_EMAIL } });
            if (!admin) {
                return res.status(404).json({ error: 'Admin not found' });
            }
            conversation = await prisma.conversation.create({
                data: {
                    userId: req.user.id,
                    adminId: admin.id
                },
                include: { messages: true }
            });
        }
        res.json({ id: conversation.id, messages: conversation.messages });
    } catch (err) {
        console.error('Error fetching user conversation:', err);
        res.status(500).json({ error: 'Failed to fetch conversation' });
    }
};

export default getUserConversation;
