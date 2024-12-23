import { Request, Response } from 'express';
import prisma from '../../db'; // Adjust the import path as necessary

const getWithdrawalRequests = async (req: Request, res: Response) => {
  try {
    const withdrawalRequests = await prisma.withdrawalRequest.findMany({
      include: {
        user: true, // Include related user data
      },
    });
    console.log(withdrawalRequests);
    res.status(200).json({ withdrawalRequests });
  } catch (err) {
    console.error('Error retrieving withdrawal requests:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default getWithdrawalRequests;