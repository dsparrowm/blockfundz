import { Request, Response } from 'express';
import prisma from '../../db';

export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;

        // Validate the id parameter
        if (!id) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Convert string ID to number since our User model uses Int for id
        const userId = parseInt(id);
        if (isNaN(userId)) {
            return res.status(400).json({ message: 'Invalid User ID format' });
        }

        // Check if user exists
        const userExists = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete user
        await prisma.user.delete({
            where: { id: userId }
        });

        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
};

export default deleteUser;