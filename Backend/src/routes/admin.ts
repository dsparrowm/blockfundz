import { Router } from 'express';
import { getAdminAuditTrail, getAdminAuditSummary } from '../handlers/admin/auditTrail';
import getAllWithdrawalRequests from '../handlers/admin/getAllWithdrawalRequests';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

// Apply auth middleware to all admin routes
router.use(authMiddleware);

// Admin audit trail routes
router.get('/audit/trail', getAdminAuditTrail);
router.get('/audit/summary', getAdminAuditSummary);

// Admin withdrawal requests route
router.get('/withdrawals/all', getAllWithdrawalRequests);

export default router;
