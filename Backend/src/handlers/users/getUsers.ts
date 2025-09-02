import prisma from "../../db"
import { Request, Response } from 'express'
import cryptoPriceService from '../../services/cryptoPriceService'

const getUsers = async (req: Request, res: Response) => {
    try {
        const userId = req.query.userId
        const users = await prisma.user.findMany({
            where: {
                NOT: {
                    email: {
                        contains: 'admin',
                        mode: 'insensitive'
                    }
                }
            },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                mainBalance: true,
                useCalculatedBalance: true,
                bitcoinBalance: true,
                ethereumBalance: true,
                usdtBalance: true,
                usdcBalance: true,
                isVerified: true,
                createdAt: true
            }
        })

        if (!users) {
            res.status(404)
            return res.json({ message: 'No user found' })
        }

        const formattedData = await Promise.all(users.map(async (user) => {
            let calculatedBalance = user.mainBalance || 0;

            // If user uses calculated balance, calculate from crypto holdings
            if (user.useCalculatedBalance) {
                try {
                    const calculated = await cryptoPriceService.calculateMainBalance({
                        bitcoinBalance: user.bitcoinBalance,
                        ethereumBalance: user.ethereumBalance,
                        usdtBalance: user.usdtBalance,
                        usdcBalance: user.usdcBalance
                    });
                    calculatedBalance = calculated;
                } catch (error) {
                    console.error(`❌ Error calculating balance for ${user.name}, using manual:`, error);
                    calculatedBalance = user.mainBalance || 0;
                }
            }

            return {
                id: user.id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                mainBalance: calculatedBalance,
                bitcoinBalance: user.bitcoinBalance || 0,
                ethereumBalance: user.ethereumBalance || 0,
                usdtBalance: user.usdtBalance || 0,
                usdcBalance: user.usdcBalance || 0,
                isVerified: user.isVerified || false,
                createdAt: user.createdAt,
                useCalculatedBalance: user.useCalculatedBalance,
                // Use calculated balance for total
                balance: calculatedBalance
            }
        }));

        res.status(200)
        return res.json({ users: formattedData })
    } catch (err) {
        console.error('❌ Error in getUsers:', err);
        throw new Error(err)
    }
}

export default getUsers;