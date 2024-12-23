import prisma from "../db";
import { Request, Response } from "express";

const getUserBalances = async (req: Request, res: Response) => {
    try {

        const { userId } = req.query
        const response = await prisma.user.findMany({

            where: {
                id: parseInt(userId),
            },
            select: {
                ethereumBalance: true,
                usdtBalance: true,
                usdcBalance: true,
                bitcoinBalance: true,
            },
        });
        const balances = response[0];
        res.json({ balances });
    } catch (error) {
        console.error("Error fetching user balances:", error);
    }
};

export default getUserBalances;