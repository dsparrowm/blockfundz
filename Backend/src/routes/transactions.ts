import { Router } from 'express';
import transactions, { getUserTransactions } from '../handlers/transactions/getTransactions';
import getNumberOfTransactions from '../handlers/transactions/getNumberOfTransactions';
import getAllTransactions from '../handlers/transactions/getAllTransactions';

const router = Router();


router.get('/users/transactions', transactions);
router.get('/transactions/count', getNumberOfTransactions);
router.get('/transactions', getAllTransactions);
router.get('/transactions', getUserTransactions);

export default router;