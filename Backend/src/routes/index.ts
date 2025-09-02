import { Router } from 'express';
import transactionsRouter from "./transactions"
import withdrawalRouter from "./withdrawals"
import investmentRouter from "./investments"
import validateTokenRouter from "./validateToken"
import sendEmailRouter from "./email"
import getDepositHistoryRouter from "./deposits"
import userRouter from "./users"
import notificationRouter from "./notification"
import adminRouter from "./admin"

const router = Router();

router.use(transactionsRouter);
router.use(userRouter);
router.use(investmentRouter);
router.use(withdrawalRouter);
router.use(validateTokenRouter);
router.use(sendEmailRouter);
router.use(getDepositHistoryRouter);
router.use(notificationRouter);
router.use('/admin', adminRouter);

export default router;