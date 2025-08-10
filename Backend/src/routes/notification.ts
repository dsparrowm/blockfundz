import { Router } from 'express';
import prisma from '../db';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

// Admin creates a notification
router.post('/admin/notifications/broadcast', authMiddleware, async (req, res) => {
    // Only allow admin
    const admin = await prisma.user.findFirst({ where: { email: process.env.ADMIN_EMAIL } });
    if (!admin || req.user.email !== admin.email) {
        return res.status(403).json({ error: 'Unauthorized: Admin access required' });
    }
    const { message } = req.body;
    const title = "Notification";
    const content = message;
    try {
        // Broadcast: create notification for every user except admin
        const users = await prisma.user.findMany({ where: { email: { not: process.env.ADMIN_EMAIL } } });
        const notifications = await Promise.all(
            users.map(() =>
                prisma.notification.create({ data: { title, content } })
            )
        );
        res.json({ count: notifications.length, notifications });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create notifications' });
    }
});

// Users fetch notifications
router.get('/notifications', authMiddleware, async (req, res) => {
    try {
        const notifications = await prisma.notification.findMany({ orderBy: { createdAt: 'desc' } });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

export default router;
