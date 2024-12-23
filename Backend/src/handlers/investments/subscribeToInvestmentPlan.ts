import { Request, Response } from 'express';
import prisma from '../../db';

const subscribeToInvestmentPlan = async (req: Request, res: Response) => {
  const { userId, planId, asset, amount } = req.body;

  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      include: {
        transactions: {
          where: {
            type: 'SUBSCRIPTION',
            status: 'ACTIVE'
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is already subscribed to the same plan
    const existingSubscription = user.transactions.find(
      t => t.planId === Number(planId) && t.status === 'ACTIVE'
    );

    if (existingSubscription) {
      return res.status(400).json({ 
        message: 'User is already subscribed to this plan'
      });
    }

    // Fetch the investment plan details
    const investmentPlan = await prisma.investmentPlan.findUnique({
      where: { id: planId },
    });

    if (!investmentPlan) {
      return res.status(404).json({ message: 'Investment plan not found' });
    }

    // If user has any other active subscription, deactivate it
    if (user.transactions.length > 0) {
      await prisma.transaction.updateMany({
        where: {
          userId: Number(userId),
          type: 'SUBSCRIPTION',
          status: 'ACTIVE'
        },
        data: {
          status: 'INACTIVE',
          details: `Subscription ended due to new plan subscription`
        }
      });
    }

    // Create new subscription transaction
    const transaction = await prisma.transaction.create({
      data: {
        type: 'SUBSCRIPTION',
        asset,
        amount: amount,
        name: user.name,
        phone: user.phone,
        status: 'ACTIVE',
        userId: Number(userId),
        planId: Number(planId),
        planName: investmentPlan.plan,
        details: `Subscribed to ${investmentPlan.plan} plan`,
      },
    });

    res.status(200).json({ 
      message: 'Subscribed to investment plan successfully', 
      transaction 
    });
  } catch (err) {
    console.error('Error subscribing to investment plan:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default subscribeToInvestmentPlan;