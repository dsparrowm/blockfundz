import { Request, Response } from 'express'
import prisma from '../../db'

export const getUserTransactions = async (req: Request, res: Response) => {
  try {
    // Get user ID from authenticated user (req.user is set by authMiddleware)
    const userId = req.user?.id;

    // Validate user ID
    if (!userId) {
      return res.status(401).json({
        error: 'User not authenticated'
      });
    }

    // Fetch transactions with pagination and sorting
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const sortBy = req.query.sortBy || 'date'
    const sortOrder = req.query.sortOrder || 'desc'

    // Calculate offset
    const offset = (page - 1) * limit

    // Fetch total count of transactions
    const totalTransactions = await prisma.transaction.count({
      where: { userId }
    })

    // Fetch paginated transactions
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: {
        [sortBy]: sortOrder
      },
      skip: offset,
      take: limit
    })

    // Return paginated results
    res.json({
      transactions,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalTransactions,
        totalPages: Math.ceil(totalTransactions / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching user transactions:', error)
    res.status(500).json({
      error: 'Failed to retrieve transactions'
    })
  }
}

export default getUserTransactions