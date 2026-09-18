import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { galleryUpload } from '../middleware/upload.js';
import * as galleryController from '../controllers/galleryController.js';

const router = Router();

router.get('/', galleryController.getAll);
router.post('/', authenticate, galleryUpload.array('images', 10), galleryController.upload);
router.put('/:id', authenticate, galleryController.updateAlt);
router.delete('/:id', authenticate, galleryController.remove);
router.patch('/reorder', authenticate, galleryController.reorder);

export default router;
