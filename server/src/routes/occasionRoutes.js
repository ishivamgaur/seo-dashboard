import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { occasionUpload } from '../middleware/upload.js';
import * as occasionController from '../controllers/occasionController.js';

const router = Router();

router.get('/', occasionController.getAll);
router.post('/', authenticate, occasionUpload.single('image'), occasionController.create);
router.put('/:id', authenticate, occasionUpload.single('image'), occasionController.update);
router.delete('/:id', authenticate, occasionController.remove);

export default router;
