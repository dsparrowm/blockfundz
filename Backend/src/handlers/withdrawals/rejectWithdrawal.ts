import { Request, Response } from 'express';
import prisma from '../../db';

const rejectWithdrawalRequest = async (req: Request, res: Response) => {
  const id = parseInt(req.query.id as string);

  try {
    const updatedRequest = await prisma.withdrawalRequest.update({
      where: { id },
      data: { status: 'REJECTED' },
    });

    res.status(200).json({ message: 'Withdrawal request rejected successfully', withdrawalRequest: updatedRequest });
  } catch (error) {
    console.error('Error rejecting withdrawal request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default rejectWithdrawalRequest;