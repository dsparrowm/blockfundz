import prisma from "../../db";
import { Request, Response } from 'express';

const updateUserProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { name, email, phone } = req.body;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Check if email is already taken by another user
        if (email) {
            const existingUser = await prisma.user.findUnique({
                where: { email }
            });

            if (existingUser && existingUser.id !== userId) {
                return res.status(400).json({ message: 'Email already in use' });
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                email,
                phone
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                isVerified: true
            }
        });

        res.status(200).json({
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export default updateUserProfile;
