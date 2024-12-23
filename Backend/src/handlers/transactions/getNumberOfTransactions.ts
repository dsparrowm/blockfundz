import prisma from "../../db";
import { Request, Response } from 'express';

const getNumberOfTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await prisma.transaction.count();
    res.status(200).json({ transactions });
  } catch (err) {
    console.error('Error retrieving number of transactions:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default getNumberOfTransactions;