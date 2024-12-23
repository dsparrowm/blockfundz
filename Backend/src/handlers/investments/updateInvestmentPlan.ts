import { Request, Response } from 'express';
import prisma from '../../db';

const updateInvestmentPlan = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { plan, minimumAmount, maximumAmount, interestRate, totalReturns } = req.body;
    try {
        const updatedPlan = await prisma.investmentPlan.update({
            where: {
                id: parseInt(id)
            },
            data: {
                plan,
                minimumAmount,
                maximumAmount,
                interestRate,
                totalReturns
            }
        });
        res.status(200);
        res.json(updatedPlan);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Something went wrong' });
        
    }
}

export default updateInvestmentPlan;