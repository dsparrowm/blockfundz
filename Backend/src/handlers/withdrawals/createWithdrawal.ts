import { Request, Response } from 'express';
import prisma from '../../db';

const createWithdrawal = async (req: Request, res: Response) => {
  const { userId, amount, asset, network, address } = req.body;

  try {
    // Validate input
    if (!userId || !amount || !asset || !network || !address) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: 'Withdrawal amount must be greater than 0' });
    }

    // Get user details to check balance
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Determine which balance field to check based on asset
    let userBalance: number;
    switch (asset) {
      case 'BITCOIN':
        userBalance = user.bitcoinBalance;
        break;
      case 'ETHEREUM':
        userBalance = user.ethereumBalance;
        break;
      case 'USDT':
        userBalance = user.usdtBalance;
        break;
      case 'USDC':
        userBalance = user.usdcBalance;
        break;
      default:
        return res.status(400).json({ message: 'Invalid asset type' });
    }

    // Check if user has sufficient balance
    if (userBalance < amount) {
      return res.status(400).json({
        message: 'Insufficient balance for withdrawal',
        currentBalance: userBalance,
        requestedAmount: amount
      });
    }

    // Create withdrawal request
    const newWithdrawal = await prisma.withdrawalRequest.create({
      data: {
        userId: Number(userId),
        amount: parseFloat(amount),
        asset,
        network,
        address,
        status: 'PENDING',
      },
    });

    res.status(201).json({
      message: 'Withdrawal request created successfully',
      withdrawal: newWithdrawal
    });
  } catch (error) {
    console.error('Error creating withdrawal request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default createWithdrawal;