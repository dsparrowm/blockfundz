import { Router, Request, Response } from 'express';
import createNewUser from '../handlers/authentication/createUser';
import signin from '../handlers/authentication/signing';
import adminLogin from '../handlers/admin/adminLogin';
import verifyEmail from '../handlers/authentication/verifyEmail';
import logout from '../handlers/authentication/logout';
import forgotPassword from '../handlers/authentication/forgotPassword';
import resetPassword from '../handlers/authentication/resetPassword';
import addNewUser from '../handlers/authentication/addNewUser';
import setWithdrawalPin from '../handlers/authentication/setWithdrawalPin';
import getWithdrawalPinStatus from '../handlers/authentication/getWithdrawalPinStatus';
import changeWithdrawalPin from '../handlers/authentication/changeWithdrawalPin';
import changePassword from '../handlers/authentication/changePassword';
import authMiddleware from '../middleware/authMiddleware';

const router = new Router();

router.post('/addUser', addNewUser);
router.post('/signup', createNewUser);
router.post('/verify-email', verifyEmail);
router.post('/signin', signin);
router.post('/admin/login', adminLogin);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/user/set-withdrawal-pin', authMiddleware, setWithdrawalPin);
router.post('/user/change-withdrawal-pin', authMiddleware, changeWithdrawalPin);
router.get('/user/withdrawal-pin-status', authMiddleware, getWithdrawalPinStatus);
router.post('/change-password', authMiddleware, changePassword);

export default router;