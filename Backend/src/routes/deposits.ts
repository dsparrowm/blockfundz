import { Router } from 'express';
import getUserDepositHistory from '../handlers/deposits/getUserDepositHistory';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

router.get('/deposits', authMiddleware, getUserDepositHistory);

export default router;