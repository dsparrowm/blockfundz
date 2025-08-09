import prisma from "../db";
import { Request, Response } from "express";
import cryptoPriceService from "../services/cryptoPriceService";

const getUserBalances = async (req: Request, res: Response) => {
    try {
        // Get user ID from authenticated user (req.user is set by authMiddleware)
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                error: 'User not authenticated'
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                ethereumBalance: true,
                usdtBalance: true,
                usdcBalance: true,
                bitcoinBalance: true,
                mainBalance: true,
            },
        });

        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        // Calculate real-time main balance
        const calculatedMainBalance = await cryptoPriceService.calculateMainBalance(user);

        // Update the stored main balance with calculated value
        await prisma.user.update({
            where: { id: userId },
            data: { mainBalance: calculatedMainBalance }
        });

        const balances = {
            ...user,
            mainBalance: calculatedMainBalance
        };

        res.json({ balances });
    } catch (error) {
        console.error("Error fetching user balances:", error);
        res.status(500).json({ error: "Failed to fetch user balances" });
    }
};

export default getUserBalances;