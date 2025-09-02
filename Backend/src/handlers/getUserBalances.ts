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
                useCalculatedBalance: true
            },
        });

        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        // Debug: log DB values read for this user to help trace balance mismatches
        try {
            console.log('[DEBUG] getUserBalances: fetched from DB', {
                userId,
                bitcoinBalance: user.bitcoinBalance,
                ethereumBalance: user.ethereumBalance,
                usdtBalance: user.usdtBalance,
                usdcBalance: user.usdcBalance,
                mainBalance: user.mainBalance,
                useCalculatedBalance: user.useCalculatedBalance
            });
        } catch (dbgErr) {
            console.warn('[DEBUG] getUserBalances: failed to log DB debug info', dbgErr);
        }

        // Only recalculate and overwrite mainBalance when the user prefers calculated balances.
        let calculatedMainBalance: number | null = null;

        if (user.useCalculatedBalance) {
            try {
                calculatedMainBalance = await cryptoPriceService.calculateMainBalance(user as any);
            } catch (err) {
                console.error('Price calculation failed in getUserBalances, falling back to stored mainBalance:', err);
                calculatedMainBalance = null;
            }

            if (calculatedMainBalance !== null) {
                // Update the stored main balance with calculated value
                await prisma.user.update({
                    where: { id: userId },
                    data: { mainBalance: calculatedMainBalance }
                });
            }
        }

        const balances = {
            ...user,
            mainBalance: user.useCalculatedBalance ? (calculatedMainBalance !== null ? calculatedMainBalance : (user.mainBalance || 0)) : (user.mainBalance || 0)
        };

        return res.json({ balances });
    } catch (error) {
        console.error("Error fetching user balances:", error);
        return res.status(500).json({ error: "Failed to fetch user balances" });
    }
};

export default getUserBalances;