import prisma from "../db";
import { Request, Response } from 'express';
import priceService from '../services/priceService';

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
                mainBalance: true,
                useCalculatedBalance: true,
                bitcoinBalance: true,
                ethereumBalance: true,
                usdtBalance: true,
                usdcBalance: true
            }
        });

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                isSuccess: false
            });
        }

        let mainBalance: number;
        let calculationDetails = null;

        if (user.useCalculatedBalance) {
            // Calculate balance from crypto holdings
            try {
                const calculation = await priceService.calculateMainBalance({
                    bitcoinBalance: user.bitcoinBalance,
                    ethereumBalance: user.ethereumBalance,
                    usdtBalance: user.usdtBalance,
                    usdcBalance: user.usdcBalance
                });

                mainBalance = calculation.totalBalance;
                calculationDetails = {
                    breakdown: calculation.breakdown,
                    prices: calculation.prices,
                    isCalculated: true
                };
            } catch (error) {
                console.error('Error calculating balance, falling back to manual:', error);
                mainBalance = user.mainBalance || 0;
                calculationDetails = { isCalculated: false, fallback: true };
            }
        } else {
            // Use manual balance
            mainBalance = user.mainBalance || 0;
            calculationDetails = { isCalculated: false };
        }

        res.status(200).json({
            message: 'Main balance fetched successfully',
            isSuccess: true,
            mainBalance,
            useCalculatedBalance: user.useCalculatedBalance,
            calculationDetails
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