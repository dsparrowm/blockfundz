import { Request, Response } from 'express';
import prisma from '../../db'; // Adjust the import path as necessary

const getAllInvestmentPlans = async (req: Request, res: Response) => {
  try {
    const investmentPlans = await prisma.investmentPlan.findMany({
      include: {
        user: true
      }
    });
    console.log("This is the investment plans", investmentPlans);
    res.status(200).json({ investmentPlans });
  } catch (err) {
    console.error('Error retrieving investment plans:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default getAllInvestmentPlans;