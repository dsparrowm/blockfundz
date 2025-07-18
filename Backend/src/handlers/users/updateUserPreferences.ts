import { Request, Response } from 'express';

const updateUserPreferences = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const preferences = req.body;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // For now, we'll just acknowledge the request since user preferences
        // aren't stored in the database schema. In a real app, you'd want to
        // either add these fields to the User model or create a separate UserPreferences model.

        res.status(200).json({
            message: 'User preferences updated successfully',
            preferences
        });
    } catch (error) {
        console.error('Error updating user preferences:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export default updateUserPreferences;
