import { Request, Response } from 'express';
import prisma from '../../db';

const approveWithdrawalRequest = async (req: Request, res: Response) => {
  const id = parseInt(req.query.id as string);

  try {
    // First, get the withdrawal request details
    const withdrawalRequest = await prisma.withdrawalRequest.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!withdrawalRequest) {
      return res.status(404).json({ message: 'Withdrawal request not found' });
    }

    if (withdrawalRequest.status !== 'PENDING') {
      return res.status(400).json({ message: 'Withdrawal request is not pending' });
    }

    // Determine which balance field to update based on asset
    let balanceField: string;
    switch (withdrawalRequest.asset) {
      case 'BITCOIN':
        balanceField = 'bitcoinBalance';
        break;
      case 'ETHEREUM':
        balanceField = 'ethereumBalance';
        break;
      case 'USDT':
        balanceField = 'usdtBalance';
        break;
      case 'USDC':
        balanceField = 'usdcBalance';
        break;
      default:
        return res.status(400).json({ message: 'Invalid asset type' });
    }

    // Check if user has sufficient balance
    const userBalance = withdrawalRequest.user[balanceField as keyof typeof withdrawalRequest.user] as number;
    if (userBalance < withdrawalRequest.amount) {
      return res.status(400).json({
        message: 'Insufficient balance for withdrawal',
        currentBalance: userBalance,
        requestedAmount: withdrawalRequest.amount
      });
    }

    // Use a transaction to ensure data consistency
    const result = await prisma.$transaction(async (prisma) => {
      // Update withdrawal request status
      const updatedRequest = await prisma.withdrawalRequest.update({
        where: { id },
        data: { status: 'APPROVED' },
      });

      // Deduct balance from user account
      await prisma.user.update({
        where: { id: withdrawalRequest.userId },
        data: {
          [balanceField]: {
            decrement: withdrawalRequest.amount
          }
        }
      });

      // Create transaction record
      await prisma.transaction.create({
        data: {
          type: 'WITHDRAWAL',
          asset: withdrawalRequest.asset,
          amount: withdrawalRequest.amount,
          status: 'COMPLETED',
          userId: withdrawalRequest.userId,
          name: withdrawalRequest.user.name,
          phone: withdrawalRequest.user.phone,
          details: `Withdrawal to ${withdrawalRequest.address}`
        }
      });

      return updatedRequest;
    });

    res.status(200).json({
      message: 'Withdrawal request approved successfully',
      withdrawalRequest: result,
      balanceDeducted: withdrawalRequest.amount,
      asset: withdrawalRequest.asset
    });
  } catch (error) {
    console.error('Error approving withdrawal request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default approveWithdrawalRequest;