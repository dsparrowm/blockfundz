import { Router, Request, Response } from 'express';
import createNewUser from '../handlers/authentication/createUser';
import signin from '../handlers/authentication/signing';
import adminLogin from '../handlers/admin/adminLogin';
import verifyEmail from '../handlers/authentication/verifyEmail';
import logout from '../handlers/authentication/logout';
import forgotPassword from '../handlers/authentication/forgotPassword';


const router = new Router();

router.post('/signup', createNewUser);
router.post('/verify-email', verifyEmail);
router.post('/signin', signin);
router.post('/admin/login', adminLogin);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);

export default router;