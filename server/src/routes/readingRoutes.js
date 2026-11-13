import { Router } from 'express';
import * as readingController from '../controllers/readingController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// All reading routes require valid JWT authentication
router.use(authenticate);

router.post('/', readingController.create);
router.get('/', readingController.list);
router.get('/:id', readingController.getOne);
router.put('/:id', readingController.update);
router.delete('/:id', readingController.remove);

export default router;
