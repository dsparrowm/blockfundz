import { Request, Response } from 'express';
import prisma from '../../db';
import crypto from 'crypto';
import sendVerificationEmail from '../../helpers/sendVerificationEmail';

const resendVerificationCode = async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
        // Find user by email
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                isSuccess: false
            });
        }

        // Check if user is already verified
        if (!user.verificationToken) {
            return res.status(400).json({
                message: 'Email is already verified',
                isSuccess: false
            });
        }

        // Generate new verification code (same format as signup)
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationTokenExpiresAt = new Date(Date.now() + 3600000); // 1 hour (same as signup)

        // Update user with new verification code
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                verificationToken: verificationCode,
                verificationTokenExpiresAt
            }
        });

        // Send verification email
        await sendVerificationEmail(user.email, verificationCode);

        res.json({
            message: 'Verification code sent successfully',
            isSuccess: true
        });
    } catch (error) {
        console.error('Resend verification code error:', error);
        res.status(500).json({
            message: 'Failed to resend verification code',
            isSuccess: false
        });
    }
};

export default resendVerificationCode;