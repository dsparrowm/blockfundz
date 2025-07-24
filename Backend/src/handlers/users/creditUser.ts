import { Request, Response } from 'express';
import prisma from '../../db';

const creditUser = async (req: Request, res: Response) => {
  const { userId, bitcoin, ethereum, usdt, usdc, mainBalance } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: Number(userId) },
      data: {
        mainBalance: mainBalance || 0,
        bitcoinBalance: bitcoin || 0,
        ethereumBalance: ethereum || 0,
        usdtBalance: usdt || 0,
        usdcBalance: usdc || 0,
      },
    });

    // Fetch user's name and phone
    const userDetails = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: { name: true, phone: true },
    });

    // Create transaction records for each updated asset (only for positive amounts)
    const transactions = [];
    if (bitcoin && bitcoin > 0) {
      transactions.push({
        type: 'DEPOSIT',
        asset: 'BITCOIN',
        amount: bitcoin,
        status: 'COMPLETED',
        userId: user.id,
        name: userDetails?.name,
        phone: userDetails?.phone,
      });
    }
    if (ethereum && ethereum > 0) {
      transactions.push({
        type: 'DEPOSIT',
        asset: 'ETHEREUM',
        amount: ethereum,
        status: 'COMPLETED',
        userId: user.id,
        name: userDetails?.name,
        phone: userDetails?.phone,
      });
    }
    if (usdt && usdt > 0) {
      transactions.push({
        type: 'DEPOSIT',
        asset: 'USDT',
        amount: usdt,
        status: 'COMPLETED',
        userId: user.id,
        name: userDetails?.name,
        phone: userDetails?.phone,
      });
    }
    if (usdc && usdc > 0) {
      transactions.push({
        type: 'DEPOSIT',
        asset: 'USDC',
        amount: usdc,
        status: 'COMPLETED',
        userId: user.id,
        name: userDetails?.name,
        phone: userDetails?.phone,
      });
    }

    // Only create transactions if there are any to create
    if (transactions.length > 0) {
      await prisma.transaction.createMany({
        data: transactions,
      });
    }

    res.status(200).json({ message: 'User balances updated successfully', isSuccess: true });
  } catch (error) {
    console.error('Error updating user balances:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default creditUser;