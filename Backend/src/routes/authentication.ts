import { Router, Request, Response } from 'express';
import createNewUser from '../handlers/authentication/createUser';
import signin from '../handlers/authentication/signing';
import adminLogin from '../handlers/admin/adminLogin';
import verifyEmail from '../handlers/authentication/verifyEmail';
import logout from '../handlers/authentication/logout';
import forgotPassword from '../handlers/authentication/forgotPassword';
import resetPassword from '../handlers/authentication/resetPassword';
import addNewUser from '../handlers/authentication/addNewUser';


const router = new Router();

router.post('/addUser', addNewUser);
router.post('/signup', createNewUser);
router.post('/verify-email', verifyEmail);
router.post('/signin', signin);
router.post('/admin/login', adminLogin);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;