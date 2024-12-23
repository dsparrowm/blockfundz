import prisma from "../../db";
import { Request, Response } from 'express';

const getNumberOfInvestments = async (req: Request, res: Response) => {
  try {
    const investments = await prisma.investmentPlan.count();
    res.status(200).json({ investments });
  } catch (err) {
    console.error('Error retrieving number of investments:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default getNumberOfInvestments;