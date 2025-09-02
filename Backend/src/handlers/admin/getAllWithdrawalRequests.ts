import { Request, Response } from 'express';
import prisma from '../../db';

const getAllWithdrawalRequests = async (req: Request, res: Response) => {
    try {
        const authenticatedUserId = req.user?.id;

        if (!authenticatedUserId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        // TODO: Add admin role check here when admin roles are implemented
        // For now, allowing all authenticated users to access (temporary for testing)

        const withdrawalRequests = await prisma.withdrawalRequest.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.status(200).json({
            withdrawalRequests,
            total: withdrawalRequests.length
        });
    } catch (err) {
        console.error('Error retrieving all withdrawal requests:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export default getAllWithdrawalRequests;