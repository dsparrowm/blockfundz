import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
    id: number;
    email: string;
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Prefer Authorization header over cookies for token extraction
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
    console.log('🔍 Auth middleware - token:', token ? 'present' : 'missing');
    console.log('🔍 Auth middleware - cookies:', req.cookies);
    console.log('🔍 Auth middleware - authorization header:', req.headers.authorization);

    if (!token) {
        console.log('❌ Auth middleware - No token provided');
        return res.status(401).json({ message: 'Not Authorized', isSuccess: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        console.log('✅ Auth middleware - Token decoded:', { id: decoded.id, email: decoded.email });
        req.user = decoded;
        next();
    } catch (error) {
        console.log('❌ Auth middleware - Token verification failed:', error.message);
        return res.status(401).json({ message: 'Not Authorized', isSuccess: false });
    }
};

export default authMiddleware;
