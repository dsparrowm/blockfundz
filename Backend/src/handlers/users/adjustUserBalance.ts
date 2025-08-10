import { Request, Response } from 'express';
import prisma from '../../db';
import { logAdminBalanceAction } from '../../helpers/adminTransactionLogger';

interface ManualBalanceRequest {
    userId: string;
    balanceType: 'main' | 'bitcoin' | 'ethereum' | 'usdt' | 'usdc';
    newAmount: number;
    adminId?: string;
    reason?: string;
}

const adjustUserBalance = async (req: Request, res: Response) => {
    try {
        const { userId, balanceType, newAmount, adminId, reason }: ManualBalanceRequest = req.body;

        if (!userId || balanceType === undefined || newAmount === undefined) {
            return res.status(400).json({
                message: 'User ID, balance type, and new amount are required',
                isSuccess: false
            });
        }

        if (newAmount < 0) {
            return res.status(400).json({
                message: 'Balance cannot be negative',
                isSuccess: false
            });
        }

        // Find the user first
        const user = await prisma.user.findUnique({
            where: { id: parseInt(userId) },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                mainBalance: true,
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

        // Get current balance for the specified type
        const getBalanceValue = (type: string) => {
            switch (type) {
                case 'main': return user.mainBalance || 0;
                case 'bitcoin': return user.bitcoinBalance || 0;
                case 'ethereum': return user.ethereumBalance || 0;
                case 'usdt': return user.usdtBalance || 0;
                case 'usdc': return user.usdcBalance || 0;
                default: return 0;
            }
        };

        const getUpdateField = (type: string) => {
            switch (type) {
                case 'main': return 'mainBalance';
                case 'bitcoin': return 'bitcoinBalance';
                case 'ethereum': return 'ethereumBalance';
                case 'usdt': return 'usdtBalance';
                case 'usdc': return 'usdcBalance';
                default: return null;
            }
        };

        const currentBalance = getBalanceValue(balanceType);
        const updateField = getUpdateField(balanceType);

        if (!updateField) {
            return res.status(400).json({
                message: 'Invalid balance type',
                isSuccess: false
            });
        }

        // Use a transaction to ensure data consistency
        const result = await prisma.$transaction(async (tx) => {
            // Update the user's balance
            const updatedUser = await tx.user.update({
                where: { id: parseInt(userId) },
                data: {
                    [updateField]: newAmount
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    mainBalance: true,
                    bitcoinBalance: true,
                    ethereumBalance: true,
                    usdtBalance: true,
                    usdcBalance: true
                }
            });

            // Log the transaction
            const amount = Math.abs(newAmount - currentBalance);
            const action = newAmount > currentBalance ? 'CREDIT' : 'DEBIT';
            const asset = balanceType === 'main' ? 'USD' : balanceType.toUpperCase();

            if (amount > 0) { // Only log if there's an actual change
                await logAdminBalanceAction({
                    userId: user.id,
                    adminId,
                    action: action as any,
                    asset: asset as any,
                    amount,
                    previousBalance: currentBalance,
                    newBalance: newAmount,
                    reason: reason || 'Manual balance adjustment',
                    details: `Admin manually adjusted ${balanceType} balance from ${currentBalance} to ${newAmount}`,
                    userName: user.name,
                    userPhone: user.phone
                });
            }

            return { updatedUser, previousBalance: currentBalance };
        });

        return res.status(200).json({
            message: `Successfully updated ${balanceType} balance for ${user.name}`,
            isSuccess: true,
            user: result.updatedUser,
            previousBalance: result.previousBalance,
            newBalance: newAmount,
            difference: newAmount - currentBalance,
            adjustedBy: adminId || 'Admin'
        });

    } catch (error: any) {
        console.error('Error adjusting user balance:', error);
        return res.status(500).json({
            message: 'Failed to adjust user balance',
            isSuccess: false,
            error: error.message
        });
    }
};

export default adjustUserBalance;
