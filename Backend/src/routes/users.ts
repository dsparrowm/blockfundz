import { Router } from 'express';
import getUsers from '../handlers/users/getUsers';
import getNumberOfUsers from '../handlers/users/getNumberOfUsers';
import creditUser from '../handlers/users/creditUser';
import getUserBalances from '../handlers/getUserBalances';
import deleteUser from '../handlers/users/deleteUser';

const router = Router();

router.get('/users', getUsers);
router.get('/users/count', getNumberOfUsers);
router.get('/users/balances', getUserBalances);
router.post('/users/credit', creditUser);
router.delete('/users', deleteUser);


export default router;