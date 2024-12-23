import {Router} from 'express';
import getUserDepositHistory from '../handlers/deposits/getUserDepositHistory';

const router = Router();

router.get('/deposits', getUserDepositHistory);

export default router;