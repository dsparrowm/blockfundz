import { Request, Response } from 'express';
import prisma from '../../db'; // Adjust the import path as necessary

const addInvestmentPlan = async (req: Request, res: Response) => {
  const { plan, minimumAmount, maximumAmount, interestRate, totalReturns } = req.body;

  try {
    const newPlan = await prisma.investmentPlan.create({
      data: { plan, minimumAmount, maximumAmount, interestRate, totalReturns },
    });
    res.status(201).json({ message: 'Investment plan added successfully', newPlan });
  } catch (err) {
    console.error('Error adding investment plan:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default addInvestmentPlan;