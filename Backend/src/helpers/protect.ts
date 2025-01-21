import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const protect = (req: Request, res: Response, next: NextFunction) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    return res.status(401).json({ message: "Not Authorized", isSuccess: false });
  }

  const [, token] = bearer.split(' ');
  if (!token) {
    res.status(401).json({ message: "Not a valid token", isSuccess: false });
    return;
  }
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
    return;

  } catch (err) {
    res.status(401).json({ message: "Not Authorized", isSuccess: false });
    return;
  }
}

export default protect;