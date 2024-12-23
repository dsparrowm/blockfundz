import { Router, Request, Response } from 'express';
import createNewUser from '../handlers/authentication/createUser';
import signin from '../handlers/authentication/signing';
import adminLogin from '../handlers/admin/adminLogin';


const router = new Router();

router.post('/signup', createNewUser);
router.post('/signin', signin);
router.post('/admin/login', adminLogin);

export default router;