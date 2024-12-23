import { Request, Response } from 'express';
import prisma from '../../db';

const createWithdrawal = async (req: Request, res: Response) => {
  const { userId, amount, asset, network, address } = req.body;

  try {
    const newWithdrawal = await prisma.withdrawalRequest.create({
      data: {
        userId: Number(userId),
        amount,
        asset,
        network,
        address,
        status: 'PENDING',
      },
    });

    res.status(201).json({ message: 'Withdrawal request created successfully', withdrawal: newWithdrawal });
  } catch (error) {
    console.error('Error creating withdrawal request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default createWithdrawal;