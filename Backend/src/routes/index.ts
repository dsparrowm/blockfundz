import { Router } from 'express';
import transactionsRouter from "./transactions"
import userRoutes from './userRoutes';
import withdrawalRouter from "./withdrawals"
import investmentRouter from "./investments"
import validateTokenRouter from "./validateToken"
import sendEmailRouter from "./email"
import getDepositHistoryRouter from "./deposits"

const router = Router();

router.use(transactionsRouter);
router.use('/users', userRoutes);
router.use(investmentRouter);
router.use(withdrawalRouter);
router.use(validateTokenRouter);
router.use(sendEmailRouter);
router.use(getDepositHistoryRouter);

export default router;