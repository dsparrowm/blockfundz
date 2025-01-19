
import { Request, Response } from 'express';
import prisma from '../db';

export const getUserTransactions = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
        const transactions = await prisma.transaction.findMany({
            where: { userId }
        });
        res.status(200).json({ transactions });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching transactions', isSuccess: false });
    }
};

export const getUserBalances = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                bitcoinBalance: true,
                ethereumBalance: true,
                usdtBalance: true,
                usdcBalance: true
            }
        });
        res.status(200).json({ balances: user });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching balances', isSuccess: false });
    }
};