import { Request, Response } from "express";
import prisma from "../../db";

const verifyUser = async (req: Request, res: Response) => {
    const { userId } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            res.status(400).send({ message: "User not found" });
            return;
        }
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                isVerified: true
            }
        });
        res.status(200).send({ message: "User verified successfully" });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });

    }
}

export default verifyUser;