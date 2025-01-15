import { Request, Response } from 'express';

const logout = async (req: Request, res: Response) => {
    res.clearCookie('token');
    res.status(200).json({
        message: 'Logged out successfully'
    });
};

export default logout;