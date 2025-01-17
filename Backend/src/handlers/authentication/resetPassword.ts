import e from "cors";
import prisma from "../../db";
import hashPassword from "../../helpers/hashPassword";
import { Request, Response } from 'express';
import sendResetSuccessfullEmail from "../../helpers/sendResetSuccessfullEmail";

const resetPassword = async (req: Request, res: Response) => {
    const { token, password } = req.body;
    try {
        const user = await prisma.user.findFirst({
            where: {
                resetPasswordToken: token,
                resetPasswordTokenExpiresAt: {
                    gt: new Date().toISOString()
                }
            }
        });
        if (!user) {
            res.status(400);
            res.json({ message: 'Invalid or expired token', isSuccess: false });
            return;
        }
        const hashedPassword = await hashPassword(password);
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordTokenExpiresAt: null
            }
        });
        const sendResetEmail = await sendResetSuccessfullEmail(user.email);
        res.status(200);
        res.json({ message: `${sendResetEmail.message}`, isSuccess: true });
    }
    catch (error) {
        res.status(500);
        res.json({ message: 'Something went wrong', isSuccess: false });
    }
}

export default resetPassword;