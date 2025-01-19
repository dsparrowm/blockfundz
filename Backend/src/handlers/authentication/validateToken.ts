import jwt from 'jsonwebtoken';
import prisma from '../../db';
import { Request, Response } from 'express';

const verifyToken = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log("Request made to validate token", token);

  if (!token) {
    return res.status(401).json({ message: 'No token provided', valid: false });
  }

  console.log("Token extracted from header", token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decoded", decoded);
    // Additional checks (e.g., check if user still exists in database)
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id
      }
    });
    console.log('This line of code just worked')
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized', valid: false });
    }
    res.status(200).json({ message: 'Token is valid', valid: true, user });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expired', valid: false });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token', valid: false });
    }
    return res.status(500).json({ message: 'Internal server error', valid: false });
  }
};

export default verifyToken;