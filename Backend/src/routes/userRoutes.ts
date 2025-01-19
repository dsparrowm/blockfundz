
import { Router } from 'express';
import { getUserTransactions, getUserBalances } from '../handlers/userHandlers';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

router.get('/transactions', authMiddleware, getUserTransactions);
router.get('/balances', authMiddleware, getUserBalances);

export default router;