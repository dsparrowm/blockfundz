import { Router } from 'express';
import { getAdminAuditTrail, getAdminAuditSummary } from '../handlers/admin/auditTrail';

const router = Router();

// Admin audit trail routes
router.get('/audit/trail', getAdminAuditTrail);
router.get('/audit/summary', getAdminAuditSummary);

export default router;
