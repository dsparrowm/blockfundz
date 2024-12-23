import { Router } from 'express';
import validateToken from '../handlers/authentication/validateToken';

const router = Router();

router.post('/validate', validateToken);

export default router;