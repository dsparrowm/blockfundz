import { Request, Response } from 'express';
import prisma from '../../db';
import crypto from 'crypto';
import sendForgotPasswordEmail from '../../helpers/sendForgotPasswordEmail';

const Client_url = process.env.CLIENT_URL || 'http://localhost:5173';

const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });
        if (!user) {
            res.status(404)
            res.json({ message: 'User not found', isSuccess: false })
            return
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
        await prisma.user.update({
            where: {
                email
            },
            data: {
                resetPasswordToken: resetToken,
                resetPasswordTokenExpiresAt: new Date(resetTokenExpiry).toISOString()
            }
        });

        // Send reset password email
        const sendPasswordResetEmail = await sendForgotPasswordEmail(email, `${Client_url}/reset-password/${resetToken}`);
        res.status(200).json({ message: 'Password reset email sent', isSuccess: true });

    } catch (error) {
        res.status(500)
        res.json({ message: "Something went wrong", isSuccess: false })

    }
}

export default forgotPassword;