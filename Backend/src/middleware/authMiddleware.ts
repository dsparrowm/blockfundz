import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
    id: number;
    email: string;
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Prefer Authorization header over cookies for token extraction
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Not Authorized', isSuccess: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Not Authorized', isSuccess: false });
    }
};

export default authMiddleware;
