import { Request, Response } from 'express';

const updateNotificationSettings = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const settings = req.body;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // For now, we'll just acknowledge the request since notification settings
        // aren't stored in the database schema. In a real app, you'd want to
        // either add these fields to the User model or create a separate UserSettings model.

        res.status(200).json({
            message: 'Notification settings updated successfully',
            settings
        });
    } catch (error) {
        console.error('Error updating notification settings:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export default updateNotificationSettings;
