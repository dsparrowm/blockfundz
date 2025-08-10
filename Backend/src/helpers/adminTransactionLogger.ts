import prisma from '../db';

interface AdminTransactionLog {
    userId: number;
    adminId?: string;
    action: 'CREDIT' | 'RESET' | 'DEBIT' | 'ADJUSTMENT';
    asset: 'BITCOIN' | 'ETHEREUM' | 'USDT' | 'USDC' | 'USD';
    amount: number;
    previousBalance: number;
    newBalance: number;
    reason?: string;
    details?: string;
    userName: string;
    userPhone?: string;
    exchangeRate?: number;
    usdEquivalent?: number;
}

export const logAdminBalanceAction = async (logData: AdminTransactionLog) => {
    try {
        const transaction = await prisma.transaction.create({
            data: {
                type: getTransactionType(logData.action, logData.asset),
                asset: logData.asset === 'USD' ? 'USDT' : logData.asset, // Map USD to USDT for schema compatibility
                amount: logData.amount,
                usdEquivalent: logData.usdEquivalent,
                exchangeRate: logData.exchangeRate,
                status: 'COMPLETED',
                userId: logData.userId,
                name: logData.userName,
                phone: logData.userPhone,
                details: logData.details || `Admin ${logData.action.toLowerCase()}: ${logData.amount} ${logData.asset} (Previous: ${logData.previousBalance}, New: ${logData.newBalance}). ${logData.reason ? `Reason: ${logData.reason}` : ''}`
            }
        });

        console.log(`✅ Admin transaction logged: ${logData.action} ${logData.amount} ${logData.asset} for user ${logData.userName} (ID: ${logData.userId})`);

        return transaction;
    } catch (error) {
        console.error('❌ Failed to log admin transaction:', error);
        throw error;
    }
};

function getTransactionType(action: string, asset: string): any {
    switch (action) {
        case 'CREDIT':
            return `CREDIT_${asset}` as any;
        case 'RESET':
        case 'DEBIT':
            return 'WITHDRAWAL';
        case 'ADJUSTMENT':
            return 'DEPOSIT';
        default:
            return 'DEPOSIT';
    }
}

// Enhanced logging for manual balance updates
export const logManualBalanceUpdate = async (
    userId: number,
    balanceType: 'main' | 'bitcoin' | 'ethereum' | 'usdt' | 'usdc',
    previousValue: number,
    newValue: number,
    adminId?: string,
    reason?: string
) => {
    // Skip logging if it's just a calculated balance sync (no real change)
    if (Math.abs(previousValue - newValue) < 0.000001) {
        return null;
    }

    // Only log if the change is significant or it's an explicit admin action
    if (adminId || Math.abs(previousValue - newValue) > 0.01) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { name: true, phone: true }
        });

        if (user) {
            const amount = newValue - previousValue;
            const action = amount > 0 ? 'CREDIT' : 'DEBIT';
            const asset = balanceType === 'main' ? 'USD' : balanceType.toUpperCase() as any;

            return await logAdminBalanceAction({
                userId,
                adminId,
                action: action as any,
                asset,
                amount: Math.abs(amount),
                previousBalance: previousValue,
                newBalance: newValue,
                reason: reason || 'Manual balance adjustment',
                userName: user.name,
                userPhone: user.phone
            });
        }
    }

    return null;
};

export default logAdminBalanceAction;
