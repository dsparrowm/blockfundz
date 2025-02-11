import prisma from "../db";
import { Request, Response } from 'express';

const getMainBalance = async (req: Request, res: Response) => {
    const { userId } = req.query
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: Number(userId)
            },
            select: {
                mainBalance: true
            }
        });
        res.status(200);
        res.json({
            message: 'Main balance fetched successfully',
            isSuccess: true,
            mainBalance: user.mainBalance
        });
    } catch (err) {
        res.status(500);
        res.json({
            message: 'Something went wrong',
            isSuccess: false
        });
    }
}

export default getMainBalance;