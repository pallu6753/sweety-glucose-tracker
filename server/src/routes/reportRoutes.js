import { Router } from 'express';
import * as reportController from '../controllers/reportController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// All reporting routes require valid JWT authentication
router.use(authenticate);

router.get('/daily', reportController.getDaily);
router.get('/month-to-date', reportController.getMonthToDate);
router.get('/monthly', reportController.getMonthly);

export default router;
