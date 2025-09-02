import { Request, Response } from 'express';
import prisma from '../../db';

interface ResetBalanceRequest {
    userId: string;
    adminId?: string;
    reason?: string;
}

const resetUserBalance = async (req: Request, res: Response) => {
    try {
        const { userId, adminId, reason }: ResetBalanceRequest = req.body;

        if (!userId) {
            return res.status(400).json({
                message: 'User ID is required',
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

        // Get current balances for logging
        const currentBalances = {
            mainBalance: user.mainBalance || 0,
            bitcoinBalance: user.bitcoinBalance || 0,
            ethereumBalance: user.ethereumBalance || 0,
            usdtBalance: user.usdtBalance || 0,
            usdcBalance: user.usdcBalance || 0
        };

        // Use a transaction to ensure data consistency
        const result = await prisma.$transaction(async (tx) => {
            // Reset all user balances to zero
            const updatedUser = await tx.user.update({
                where: { id: parseInt(userId) },
                data: {
                    mainBalance: 0,
                    bitcoinBalance: 0,
                    ethereumBalance: 0,
                    usdtBalance: 0,
                    usdcBalance: 0
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

            // Delete all transactions for this user as part of the reset
            const deleted = await tx.transaction.deleteMany({
                where: { userId: parseInt(userId) }
            });

            // Log the reset action for admin audit purposes (console logging only)
            console.log(`Admin reset all balances for user ${user.name} (ID: ${user.id}). Previous balances:`, currentBalances);
            console.log(`Reset reason: ${reason || 'Balance reset by admin'}`);
            console.log(`Reset by admin ID: ${adminId || 'Unknown'}`);

            return { updatedUser, deletedCount: deleted.count };
        });

        return res.status(200).json({
            message: `Successfully reset all balances for ${user.name}`,
            isSuccess: true,
            user: result.updatedUser,
            previousBalances: currentBalances,
            deletedTransactions: result.deletedCount,
            resetBy: adminId || 'Admin'
        });

    } catch (error: any) {
        console.error('Error resetting user balance:', error);
        return res.status(500).json({
            message: 'Failed to reset user balance',
            isSuccess: false,
            error: error.message
        });
    }
};

export default resetUserBalance;
