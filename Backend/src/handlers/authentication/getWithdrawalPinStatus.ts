import { Request, Response } from 'express';
import prisma from '../../db';

const getWithdrawalPinStatus = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const user = await prisma.user.findUnique({
            where: { id: Number(userId) },
            select: { withdrawalPin: true },
        });

        res.json({ hasPin: !!user?.withdrawalPin });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch withdrawal pin status', error });
    }
};

export default getWithdrawalPinStatus;
