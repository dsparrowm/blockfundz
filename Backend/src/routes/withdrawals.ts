import { Router } from 'express';
import getWithdrawalRequests from '../handlers/withdrawals/withdrawalRequests';
import createWithdrawal from '../handlers/withdrawals/createWithdrawal';
import approveWithdrawalRequest from '../handlers/withdrawals/approveWithdrawal';
import rejectWithdrawalRequest from '../handlers/withdrawals/rejectWithdrawal';

const router = Router();

router.get('/withdrawals', getWithdrawalRequests);
router.post('/withdrawals', createWithdrawal);
router.post('/withdrawals/approve', approveWithdrawalRequest);
router.post('/withdrawals/reject', rejectWithdrawalRequest);

export default router;