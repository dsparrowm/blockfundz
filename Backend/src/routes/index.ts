import { Router } from 'express';
// import dashboardRouter from "./dashboard"
import transactionsRouter from "./transactions"
import userRouter from "./users"
import withdrawalRouter from "./withdrawals"
import investmentRouter from "./investments"
import validateTokenRouter from "./validateToken"
import sendEmailRouter from "./email"
import getDepositHistoryRouter from "./deposits"

const router = Router();

// router.use(dashboardRouter);
router.use(transactionsRouter);
router.use(userRouter);
router.use(investmentRouter);
router.use(withdrawalRouter);
router.use(validateTokenRouter);
router.use(sendEmailRouter);
router.use(getDepositHistoryRouter);

export default router;