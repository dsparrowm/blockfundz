import { Router } from 'express';
import prisma from '../db';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

// Fetch all notifications created by admin
router.get('/notifications', authMiddleware, async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const [notifications, total] = await Promise.all([
            prisma.notification.findMany({
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.notification.count()
        ]);

        res.json({ notifications, total, page, limit });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

// Create a new notification
router.post('/notifications', authMiddleware, async (req, res) => {
    const { title, content } = req.body;
    try {
        const notification = await prisma.notification.create({ data: { title, content } });
        // Emit real-time event
        const { io } = require('../socket');
        io.emit('new-notification', notification);
        res.json(notification);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create notification' });
    }
});


// Delete a notification
router.delete('/notifications/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.notification.delete({ where: { id } });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete notification' });
    }
});

// Edit a notification
router.put('/notifications/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    try {
        const notification = await prisma.notification.update({
            where: { id },
            data: { title, content }
        });
        res.json(notification);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update notification' });
    }
});

export default router;
