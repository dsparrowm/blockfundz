import prisma from "../../db";
import { Request, Response } from 'express';

const getNumberOfUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.count();
    res.status(200).json({ users });
  } catch (err) {
    console.error('Error retrieving number of users:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default getNumberOfUsers;