//get user passwrod in plain text using ID
import { Request, Response } from 'express';
import prisma from '../../db';

// Route handler to get user password by ID
const getUserPassword = async (req: Request, res: Response) => {
    try {
        const idStr = req.query.id as string;
        if (!idStr) return res.status(400).json({ error: 'User ID is required' });
        const id = Number(idStr);
        if (isNaN(id)) return res.status(400).json({ error: 'User ID must be a number' });
        const user = await prisma.user.findUnique({
            where: { id },
            select: { password: true }
        });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ password: user.password });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

export default getUserPassword;