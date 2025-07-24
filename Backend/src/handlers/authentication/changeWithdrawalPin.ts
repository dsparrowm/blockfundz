import { Request, Response } from 'express';
import prisma from '../../db';

const changeWithdrawalPin = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { currentPin, newPin } = req.body;

        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        if (!currentPin || !newPin) {
            return res.status(400).json({ message: 'Current PIN and new PIN are required' });
        }

        if (!/^\d{4}$/.test(currentPin) || !/^\d{4}$/.test(newPin)) {
            return res.status(400).json({ message: 'PIN must be a 4-digit number' });
        }

        // Get user's current PIN
        const user = await prisma.user.findUnique({
            where: { id: Number(userId) },
            select: { withdrawalPin: true },
        });

        if (!user || !user.withdrawalPin) {
            return res.status(400).json({ message: 'No withdrawal PIN is currently set' });
        }

        // Verify current PIN
        if (user.withdrawalPin !== Number(currentPin)) {
            return res.status(400).json({ message: 'Current PIN is incorrect' });
        }

        // Update to new PIN
        await prisma.user.update({
            where: { id: Number(userId) },
            data: { withdrawalPin: Number(newPin) },
        });

        res.status(200).json({ message: 'Withdrawal PIN changed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to change withdrawal PIN', error });
    }
};

export default changeWithdrawalPin;
