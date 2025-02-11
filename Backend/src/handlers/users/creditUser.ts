import { Request, Response } from 'express';
import prisma from '../../db';

const creditUser = async (req: Request, res: Response) => {
  const { userId, bitcoin, ethereum, usdt, usdc, mainBalance } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: Number(userId) },
      data: {
        mainBalance: { increment: mainBalance },
        bitcoinBalance: { increment: bitcoin },
        ethereumBalance: { increment: ethereum },
        usdtBalance: { increment: usdt },
        usdcBalance: { increment: usdc },
      },
    });

    // Fetch user's name and phone
    const userDetails = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: { name: true, phone: true },
    });

    // Create transaction records for each credited asset
    const transactions = [];
    if (bitcoin > 0) {
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
    if (ethereum > 0) {
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
    if (usdt > 0) {
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
    if (usdc > 0) {
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

    await prisma.transaction.createMany({
      data: transactions,
    });

    res.status(200).json({ message: 'User balances updated and transactions recorded successfully', isSuccess: true });
  } catch (error) {
    console.error('Error crediting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default creditUser;