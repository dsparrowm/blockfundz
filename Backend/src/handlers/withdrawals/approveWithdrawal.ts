import { Request, Response } from 'express';
import prisma from '../../db';

const approveWithdrawalRequest = async (req: Request, res: Response) => {
  const id = parseInt(req.query.id as string);

  try {
    const updatedRequest = await prisma.withdrawalRequest.update({
      where: { id },
      data: { status: 'APPROVED' },
    });

    res.status(200).json({ message: 'Withdrawal request approved successfully', withdrawalRequest: updatedRequest });
  } catch (error) {
    console.error('Error approving withdrawal request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default approveWithdrawalRequest;