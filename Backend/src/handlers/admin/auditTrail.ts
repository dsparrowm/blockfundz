import { Request, Response } from 'express';
import prisma from '../../db';

interface AdminAuditQuery {
    userId?: string;
    adminId?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
}

const getAdminAuditTrail = async (req: Request, res: Response) => {
    try {
        const {
            userId,
            adminId,
            action,
            startDate,
            endDate,
            limit = 50,
            offset = 0
        }: AdminAuditQuery = req.query as any;

        // Build where clause for filtering
        const whereClause: any = {};

        if (userId) {
            whereClause.userId = parseInt(userId);
        }

        if (action) {
            whereClause.type = {
                contains: action.toUpperCase()
            };
        }

        if (startDate || endDate) {
            whereClause.date = {};
            if (startDate) {
                whereClause.date.gte = new Date(startDate);
            }
            if (endDate) {
                whereClause.date.lte = new Date(endDate);
            }
        }

        // Get transactions with admin-related actions
        const transactions = await prisma.transaction.findMany({
            where: {
                ...whereClause,
                OR: [
                    { details: { contains: 'Admin' } },
                    { type: { in: ['CREDIT_BITCOIN', 'CREDIT_ETHEREUM', 'CREDIT_USDT', 'CREDIT_USDC'] } }
                ]
            },
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
                date: 'desc'
            },
            take: parseInt(limit as any),
            skip: parseInt(offset as any)
        });

        // Get total count for pagination
        const totalCount = await prisma.transaction.count({
            where: {
                ...whereClause,
                OR: [
                    { details: { contains: 'Admin' } },
                    { type: { in: ['CREDIT_BITCOIN', 'CREDIT_ETHEREUM', 'CREDIT_USDT', 'CREDIT_USDC'] } }
                ]
            }
        });

        // Format the response
        const auditTrail = transactions.map(tx => ({
            id: tx.id,
            timestamp: tx.date,
            action: tx.type,
            asset: tx.asset,
            amount: tx.amount,
            usdEquivalent: tx.usdEquivalent,
            status: tx.status,
            details: tx.details,
            user: {
                id: tx.user.id,
                name: tx.user.name,
                email: tx.user.email,
                phone: tx.user.phone
            },
            userId: tx.userId
        }));

        return res.status(200).json({
            message: 'Admin audit trail retrieved successfully',
            auditTrail,
            pagination: {
                total: totalCount,
                limit: parseInt(limit as any),
                offset: parseInt(offset as any),
                hasMore: (parseInt(offset as any) + parseInt(limit as any)) < totalCount
            }
        });

    } catch (error: any) {
        console.error('Error retrieving admin audit trail:', error);
        return res.status(500).json({
            message: 'Failed to retrieve admin audit trail',
            error: error.message
        });
    }
};

// Get summary statistics for admin actions
const getAdminAuditSummary = async (req: Request, res: Response) => {
    try {
        const { startDate, endDate } = req.query;

        const whereClause: any = {};
        if (startDate || endDate) {
            whereClause.date = {};
            if (startDate) {
                whereClause.date.gte = new Date(startDate as string);
            }
            if (endDate) {
                whereClause.date.lte = new Date(endDate as string);
            }
        }

        // Get summary statistics
        const [
            totalCredits,
            totalResets,
            totalWithdrawals,
            recentActions,
            totalUsdValue
        ] = await Promise.all([
            // Count credit actions
            prisma.transaction.count({
                where: {
                    ...whereClause,
                    type: { in: ['CREDIT_BITCOIN', 'CREDIT_ETHEREUM', 'CREDIT_USDT', 'CREDIT_USDC'] }
                }
            }),

            // Count reset actions
            prisma.transaction.count({
                where: {
                    ...whereClause,
                    details: { contains: 'reset' }
                }
            }),

            // Count withdrawal approvals
            prisma.transaction.count({
                where: {
                    ...whereClause,
                    type: 'WITHDRAWAL',
                    details: { contains: 'Admin' }
                }
            }),

            // Get recent actions (last 24 hours)
            prisma.transaction.count({
                where: {
                    date: {
                        gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
                    },
                    OR: [
                        { details: { contains: 'Admin' } },
                        { type: { in: ['CREDIT_BITCOIN', 'CREDIT_ETHEREUM', 'CREDIT_USDT', 'CREDIT_USDC'] } }
                    ]
                }
            }),

            // Calculate total USD value of admin actions
            prisma.transaction.aggregate({
                where: {
                    ...whereClause,
                    OR: [
                        { details: { contains: 'Admin' } },
                        { type: { in: ['CREDIT_BITCOIN', 'CREDIT_ETHEREUM', 'CREDIT_USDT', 'CREDIT_USDC'] } }
                    ]
                },
                _sum: {
                    usdEquivalent: true
                }
            })
        ]);

        return res.status(200).json({
            message: 'Admin audit summary retrieved successfully',
            summary: {
                totalCredits,
                totalResets,
                totalWithdrawals,
                recentActions,
                totalUsdValue: totalUsdValue._sum.usdEquivalent || 0,
                period: {
                    startDate: startDate || 'All time',
                    endDate: endDate || 'Present'
                }
            }
        });

    } catch (error: any) {
        console.error('Error retrieving admin audit summary:', error);
        return res.status(500).json({
            message: 'Failed to retrieve admin audit summary',
            error: error.message
        });
    }
};

export { getAdminAuditTrail, getAdminAuditSummary };
