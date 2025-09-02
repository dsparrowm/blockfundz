import prisma from '../db';
import cryptoPriceService from '../services/cryptoPriceService';

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
        // Ensure we have exchange rate / USD equivalent for non-USD assets when possible
        let exchangeRate = logData.exchangeRate;
        let usdEquivalent = logData.usdEquivalent;

        const assetUpper = (logData.asset || '').toUpperCase();
        if (assetUpper !== 'USD' && (!exchangeRate || !usdEquivalent)) {
            try {
                const rate = await cryptoPriceService.getAssetPrice(assetUpper);
                exchangeRate = exchangeRate ?? rate;
                usdEquivalent = usdEquivalent ?? (logData.amount * rate);
            } catch (priceErr) {
                console.warn('Could not fetch exchange rate for admin log; proceeding without usdEquivalent:', priceErr);
            }
        }

        // Preserve original asset information in details to avoid silent remapping issues
        const originalAssetNote = logData.asset && logData.asset !== (logData.asset === 'USD' ? 'USDT' : logData.asset)
            ? ` OriginalAsset:${logData.asset};` : '';

        const transaction = await prisma.transaction.create({
            data: {
                type: getTransactionType(logData.action, logData.asset),
                // Keep mapping for legacy schema compatibility but note original asset in details
                asset: logData.asset === 'USD' ? 'USDT' : logData.asset,
                amount: logData.amount,
                usdEquivalent: usdEquivalent,
                exchangeRate: exchangeRate,
                status: 'COMPLETED',
                userId: logData.userId,
                name: logData.userName,
                phone: logData.userPhone,
                details: logData.details || `Admin ${logData.action.toLowerCase()}: ${logData.amount} ${logData.asset} (Previous: ${logData.previousBalance}, New: ${logData.newBalance}). ${logData.reason ? `Reason: ${logData.reason}` : ''}` + originalAssetNote
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
            // Explicit transaction type for admin resets to avoid being classified as withdrawals
            return 'ADMIN_RESET';
        case 'DEBIT':
            return 'WITHDRAWAL';
        case 'ADJUSTMENT':
            return 'ADJUSTMENT';
        default:
            return 'ADJUSTMENT';
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

            // Attempt to enrich with exchange rate and usdEquivalent when dealing with crypto assets
            let exchangeRate: number | undefined = undefined;
            let usdEquivalent: number | undefined = undefined;
            if (asset !== 'USD') {
                try {
                    exchangeRate = await cryptoPriceService.getAssetPrice(asset);
                    usdEquivalent = Math.abs(amount) * exchangeRate;
                } catch (err) {
                    console.warn('Failed to fetch exchange rate for manual balance log:', err);
                }
            } else {
                // For USD, usdEquivalent is the same as amount
                usdEquivalent = Math.abs(amount);
                exchangeRate = 1;
            }

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
                userPhone: user.phone,
                exchangeRate,
                usdEquivalent
            });
        }
    }

    return null;
};

export default logAdminBalanceAction;
