import { Router } from 'express';
import { getSeo, updateSeo } from '../controllers/seoController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.get('/', getSeo);
router.put('/', authenticate, updateSeo);

export default router;
