import dotenv from 'dotenv';
dotenv.config();
import app from './server';
import http from 'http';
import prisma from './db';
import jwt from 'jsonwebtoken';
import authMiddleware from './middleware/authMiddleware';
import editTransaction from './handlers/transactions/editTransactions';
import { InterestCalculationService } from './services/InterestCalculationService';

const server = http.createServer(app);

const JWT_SECRET = process.env.JWT_SECRET || 'cookies';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@mail.com';

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