import { Router } from 'express';
import getWithdrawalRequests from '../handlers/withdrawals/withdrawalRequests';
import createWithdrawal from '../handlers/withdrawals/createWithdrawal';
import approveWithdrawalRequest from '../handlers/withdrawals/approveWithdrawal';
import rejectWithdrawalRequest from '../handlers/withdrawals/rejectWithdrawal';
import setWithdrawalPin from '../handlers/authentication/setWithdrawalPin';
import changeWithdrawalPin from '../handlers/authentication/changeWithdrawalPin';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

router.get('/withdrawals', authMiddleware, getWithdrawalRequests);
router.post('/withdrawals', authMiddleware, createWithdrawal);
router.post('/withdrawals/approve', approveWithdrawalRequest);
router.post('/withdrawals/reject', rejectWithdrawalRequest);
router.post('/withdrawals/set-withdrawal-pin', setWithdrawalPin);
router.post('/withdrawals/change-withdrawal-pin', changeWithdrawalPin);

export default router;