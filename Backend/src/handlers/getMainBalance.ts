import prisma from "../db";
import { Request, Response } from 'express';

const getMainBalance = async (req: Request, res: Response) => {
    try {
        // Get user ID from authenticated user (req.user is set by authMiddleware)
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                message: 'User not authenticated',
                isSuccess: false
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                mainBalance: true
            }
        });

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                isSuccess: false
            });
        }

        res.status(200).json({
            message: 'Main balance fetched successfully',
            isSuccess: true,
            mainBalance: user.mainBalance
        });
    } catch (err) {
        console.error('Error fetching main balance:', err);
        res.status(500).json({
            message: 'Something went wrong',
            isSuccess: false
        });
    }
}

export default getMainBalance;