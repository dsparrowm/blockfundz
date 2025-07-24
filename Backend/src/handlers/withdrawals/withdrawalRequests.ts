import { Request, Response } from 'express';
import prisma from '../../db'; // Adjust the import path as necessary

const getWithdrawalRequests = async (req: Request, res: Response) => {
  try {
    const authenticatedUserId = req.user?.id;
    const requestedUserId = req.query.userId;

    if (!authenticatedUserId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    let withdrawalRequests;

    if (requestedUserId) {
      // Specific user request: return only their withdrawal requests
      withdrawalRequests = await prisma.withdrawalRequest.findMany({
        where: {
          userId: Number(requestedUserId)
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc' // Sort by newest first
        }
      });
    } else {
      // Default to authenticated user's requests
      withdrawalRequests = await prisma.withdrawalRequest.findMany({
        where: {
          userId: Number(authenticatedUserId)
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc' // Sort by newest first
        }
      });
    }

    res.status(200).json({ withdrawalRequests });
  } catch (err) {
    console.error('Error retrieving withdrawal requests:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default getWithdrawalRequests;