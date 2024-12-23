import { Request, Response } from 'express';
import prisma from '../../db'; // Adjust the import path as necessary

const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        user: true, // Include related user data
      },
    });
    res.status(200).json({ transactions });
  } catch (err) {
    console.error('Error retrieving transactions:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default getAllTransactions;