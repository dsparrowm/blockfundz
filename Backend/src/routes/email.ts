import {Router} from 'express';
import sendEmailToUsers from '../handlers/sendEmailToUsers';

const router = Router();

router.post('/email', sendEmailToUsers);

export default router;