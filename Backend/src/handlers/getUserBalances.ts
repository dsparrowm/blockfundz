import prisma from "../db";
import { Request, Response } from "express";

const getUserBalances = async (req: Request, res: Response) => {
    try {
        // Get user ID from authenticated user (req.user is set by authMiddleware)
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                error: 'User not authenticated'
            });
        }

        const response = await prisma.user.findMany({
            where: {
                id: userId,
            },
            select: {
                ethereumBalance: true,
                usdtBalance: true,
                usdcBalance: true,
                bitcoinBalance: true,
            },
        });
        const balances = response[0];
        res.json({ balances });
    } catch (error) {
        console.error("Error fetching user balances:", error);
        res.status(500).json({ error: "Failed to fetch user balances" });
    }
};

export default getUserBalances;