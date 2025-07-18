import { Request, Response } from 'express';
import prisma from '../../db';

const getUserDepositHistory = async (req: Request, res: Response) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const userIdNumber = parseInt(userId as string, 10);

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