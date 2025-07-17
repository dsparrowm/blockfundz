import { Router } from 'express';
import { getUserTransactions } from '../handlers/transactions/getTransactions';
import getNumberOfTransactions from '../handlers/transactions/getNumberOfTransactions';
import getAllTransactions from '../handlers/transactions/getAllTransactions';
import createTransaction from '../handlers/transactions/createTransactions';
import editTransaction from '../handlers/transactions/editTransactions';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

// User-specific routes (require authentication)
router.get('/users/transactions', authMiddleware, getUserTransactions);

// Admin routes (return all data)
router.get('/transactions/count', getNumberOfTransactions);
router.get('/transactions', getAllTransactions); // Admin only - gets all transactions
router.post('/transactions', createTransaction);
router.put('/transactions/:id', editTransaction);

export default router;