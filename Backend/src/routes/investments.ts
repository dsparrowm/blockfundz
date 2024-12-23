import { Router } from 'express';
import getNumberOfInvestments from '../handlers/investments/getNumberOfInvestments';
import getAllInvestmentPlans from '../handlers/investments/getAllInvestmentPlans';
import subscribeToInvestmentPlan from '../handlers/investments/subscribeToInvestmentPlan';
import addInvestmentPlan from '../handlers/investments/addInvestmentPlan';
import updateInvestmentPlan from '../handlers/investments/updateInvestmentPlan';
import deleteInvestmentPlan from '../handlers/investments/deleteInvestmentPlan';

const router = Router();

router.get('/investments/count', getNumberOfInvestments);
router.get('/investments', getAllInvestmentPlans);
router.post('/investments/subscribe', subscribeToInvestmentPlan);
router.post('/investments/add', addInvestmentPlan);
router.put('/investments/:id', updateInvestmentPlan);
router.delete('/investments/:id', deleteInvestmentPlan);


export default router;