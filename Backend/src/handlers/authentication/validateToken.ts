import jwt from 'jsonwebtoken';
import prisma from '../../db';

const validateToken = async (req, res) => {
  const Authorization = 
    req.headers['authorization']?.split(' ')[1] || // Bearer token format
    req.headers['x-access-token'] || 
    req.headers['token'] ||
    req.body.token ||
    req.query.token;
  console.log("Headers", Authorization);
  console.log("Request made to validate token", Authorization);

  if (!Authorization) {
    return res.status(401).json({ message: 'No token provided', valid: false });
  }

  const token = Authorization.split(' ')[1];
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

export default validateToken;