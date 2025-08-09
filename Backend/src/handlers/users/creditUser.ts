import { Request, Response } from 'express';
import prisma from '../../db';
import cryptoPriceService from '../../services/cryptoPriceService';

interface CreditRequest {
  userId: number;
  currency: 'BITCOIN' | 'ETHEREUM' | 'USDT' | 'USDC';
  amount: number;
  reason?: string;
  adminId?: number;
}

const creditUser = async (req: Request, res: Response) => {
  const { userId, currency, amount, reason, adminId }: CreditRequest = req.body;

  try {
    // Validation
    if (!userId || !currency || !amount || amount <= 0) {
      return res.status(400).json({
        message: 'userId, currency, and positive amount are required'
      });
    }

    // Validate currency type
    const validCurrencies = ['BITCOIN', 'ETHEREUM', 'USDT', 'USDC'];
    if (!validCurrencies.includes(currency)) {
      return res.status(400).json({
        message: 'Invalid currency. Must be BITCOIN, ETHEREUM, USDT, or USDC'
      });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        bitcoinBalance: true,
        ethereumBalance: true,
        usdtBalance: true,
        usdcBalance: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get current exchange rate and calculate USD equivalent
    const exchangeRate = await cryptoPriceService.getAssetPrice(currency);
    const usdEquivalent = amount * exchangeRate;

    // Start database transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create transaction record first
      const transaction = await tx.transaction.create({
        data: {
          type: `CREDIT_${currency}` as any,
          asset: currency as any,
          amount: amount,
          usdEquivalent: usdEquivalent,
          exchangeRate: exchangeRate,
          status: 'COMPLETED',
          userId: user.id,
          name: user.name,
          phone: user.phone,
          reason: reason || 'Admin credit',
          adminId: adminId,
          details: `Admin credited ${amount} ${currency} (${usdEquivalent.toFixed(2)} USD)`
        }
      });

      // Update user's specific crypto balance
      const balanceField = `${currency.toLowerCase()}Balance` as 'bitcoinBalance' | 'ethereumBalance' | 'usdtBalance' | 'usdcBalance';
      const currentBalance = user[balanceField] || 0;
      const newBalance = currentBalance + amount;

      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          [balanceField]: newBalance
        },
        select: {
          id: true,
          name: true,
          email: true,
          bitcoinBalance: true,
          ethereumBalance: true,
          usdtBalance: true,
          usdcBalance: true
        }
      });

      return { transaction, updatedUser };
    });

    // Calculate new main balance
    const newMainBalance = await cryptoPriceService.calculateMainBalance(result.updatedUser);

    // Update main balance
    await prisma.user.update({
      where: { id: user.id },
      data: { mainBalance: newMainBalance }
    });

    return res.status(200).json({
      message: `Successfully credited ${amount} ${currency} to ${user.name}`,
      transaction: result.transaction,
      user: {
        ...result.updatedUser,
        mainBalance: newMainBalance
      },
      exchangeRate,
      usdEquivalent: usdEquivalent.toFixed(2)
    });

  } catch (error: any) {
    console.error('Error crediting user:', error);
    return res.status(500).json({
      message: 'Failed to credit user',
      error: error.message
    });
  }
};

export default creditUser;