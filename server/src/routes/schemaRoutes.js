import { Router } from 'express';
import { getAll, getOne, create, update, remove, toggleActive } from '../controllers/schemaController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', authenticate, create);
router.put('/:id', authenticate, update);
router.delete('/:id', authenticate, remove);
router.patch('/:id/toggle', authenticate, toggleActive);

export default router;
