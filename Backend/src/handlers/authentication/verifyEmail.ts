import { Request, Response } from 'express';
import prisma from '../../db';
import sendWelcomeEmail from '../../helpers/sendWelcomeEmail';

const verifyEmail = async (req: Request, res: Response) => {
    const { email, code } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: {
                verificationToken: code,
                verificationTokenExpiresAt: {
                    gte: new Date()
                },
                email,
            }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid verification code' });
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                verificationToken: null,
                verificationTokenExpiresAt: null
            }
        });

        await sendWelcomeEmail(updatedUser.email, updatedUser.name);

        res.json({
            message: 'Email verified successfully',
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

export default verifyEmail;