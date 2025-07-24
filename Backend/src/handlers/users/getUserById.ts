import prisma from "../../db"
import { Request, Response } from 'express'

const getUserById = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const userData = await prisma.user.findUnique({
            where: {
                id: Number(userId)
            },
        });

        if (!userData) {
            res.status(404);
            return res.json({ message: 'No userData found' });
        }

        // format userData data
        const user = {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            phone: userData.phone,
            isVerified: userData.isVerified,
            mainBalance: userData.mainBalance,
            balances: [{ Bitcoin: userData.bitcoinBalance, Usdt: userData.usdtBalance, Usdc: userData.usdcBalance, Ethereum: userData.ethereumBalance }]
        };

        res.status(200);
        return res.json({ user });
    } catch (err) {
        console.error('Error fetching user data:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export default getUserById;