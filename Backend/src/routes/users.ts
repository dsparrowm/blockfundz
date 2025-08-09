import { Router } from 'express';
import getUsers from '../handlers/users/getUsers';
import getNumberOfUsers from '../handlers/users/getNumberOfUsers';
import creditUser from '../handlers/users/creditUser';
import getUserBalances from '../handlers/getUserBalances';
import deleteUser from '../handlers/users/deleteUser';
import verifyUser from '../handlers/users/verifyUser';
import getUserById from '../handlers/users/getUserById';
import getMainBalance from '../handlers/getMainBalance';
import getUserPassword from '../handlers/users/getUserPassword';
import updateUserProfile from '../handlers/users/updateUserProfile';
import updateNotificationSettings from '../handlers/users/updateNotificationSettings';
import updateUserPreferences from '../handlers/users/updateUserPreferences';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

// Admin routes (no auth middleware needed, handled separately)
router.get('/users', getUsers);
router.get('/users/count', getNumberOfUsers);
router.get('/users/password', getUserPassword);
router.post('/users/credit', creditUser);
router.delete('/users/:id', deleteUser);
router.post('/users/verify-user', verifyUser);

// User-specific routes (require authentication)
router.get('/user', authMiddleware, getUserById);
router.get('/users/main-balance', authMiddleware, getMainBalance);
router.get('/users/balances', authMiddleware, getUserBalances);
router.put('/users/profile', authMiddleware, updateUserProfile);
router.put('/users/notifications', authMiddleware, updateNotificationSettings);
router.put('/users/preferences', authMiddleware, updateUserPreferences);

export default router;