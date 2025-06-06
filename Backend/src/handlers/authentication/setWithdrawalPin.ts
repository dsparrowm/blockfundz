import { Request, Response } from 'express';
import prisma from '../../db';

const setWithdrawalPin = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id || req.body.userId; // Adjust this line if you use JWT middleware
        const { pin } = req.body;

        if (!/^\d{4}$/.test(pin)) {
            return res.status(400).json({ message: 'Pin must be a 4-digit number' });
        }

        await prisma.user.update({
            where: { id: Number(userId) },
            data: { withdrawalPin: pin },
        });

        res.status(200).json({ message: 'Withdrawal pin set successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to set withdrawal pin', error });
    }
};

export default setWithdrawalPin;
