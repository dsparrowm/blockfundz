import { Request, Response } from 'express';
import prisma from '../../db';
import sendWelcomeEmail from '../../helpers/sendWelcomeEmail';

const verifyEmail = async (req: Request, res: Response) => {
    const { email, verificationCode } = req.body;

    const user = await prisma.user.findUnique({
        where: {
            email,
            verificationToken: verificationCode,
            verificationTokenExpiresAt: {
                gte: new Date()
            }
        }
    });

    if (!user) {
        throw new Error('Invalid verification code');
    }

    const updatedUser = await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            isVerified: true,
            verificationToken: null,
            verificationTokenExpiresAt: null
        }
    });

    await sendWelcomeEmail(updatedUser.email, updatedUser.name);

    res.json({
        message: 'Email verified successfully',
        user: updatedUser
    });
}

export default verifyEmail;