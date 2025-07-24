import { Request, Response } from 'express';
import prisma from '../../db';

const createWithdrawal = async (req: Request, res: Response) => {
  const authenticatedUserId = req.user?.id;
  const { amount, asset, network, address, pin } = req.body;

  try {
    // Check authentication
    if (!authenticatedUserId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Validate input
    if (!amount || !asset || !network || !address || !pin) {
      return res.status(400).json({ message: 'All fields including PIN are required' });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: 'Withdrawal amount must be greater than 0' });
    }

    // Validate PIN format
    if (!/^\d{4}$/.test(pin)) {
      return res.status(400).json({ message: 'PIN must be a 4-digit number' });
    }

    // Get user details to check balance and PIN
    const user = await prisma.user.findUnique({
      where: { id: Number(authenticatedUserId) }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has set a withdrawal PIN
    if (!user.withdrawalPin) {
      return res.status(400).json({ message: 'Please set a withdrawal PIN first' });
    }

    // Validate the PIN
    if (user.withdrawalPin !== Number(pin)) {
      return res.status(400).json({ message: 'Invalid withdrawal PIN' });
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
        userId: Number(authenticatedUserId),
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