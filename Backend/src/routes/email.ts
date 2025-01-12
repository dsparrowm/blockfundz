import {Router} from 'express';
import sendEmailToUsers from '../handlers/sendEmailToUsers';
import sendSupportEmail from '../helpers/privateEmail';

const router = Router();

router.post('/email', sendSupportEmail);

export default router;