import { Request, Response } from 'express';
import prisma from '../../db';

const getUserDepositHistory = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    const userIdNumber = Number(userId);

    if (isNaN(userIdNumber)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const deposits = await prisma.transaction.findMany({
      where: {
        AND: [
          { userId: userIdNumber },
          { type: 'DEPOSIT' }
        ]
      },
      orderBy: {
        date: 'desc' // Most recent first
      }
    });

    // Format the data as expected by the client
    const formattedDeposits = deposits.map(deposit => ({
      id: deposit.id,
      type: deposit.type,
      asset: deposit.asset,
      amount: deposit.amount,
      network: deposit.asset + ' Network',
      status: deposit.status,
      date: deposit.date,
    }));

    res.status(200).json({ deposits: formattedDeposits });
  } catch (error) {
    console.error('Error fetching deposit history:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default getUserDepositHistory;