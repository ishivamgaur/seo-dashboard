import { Router } from 'express';
import { login, getMe } from '../controllers/authController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { loginRules } from '../validators/authValidator.js';

const router = Router();

router.post('/login', validate(loginRules), login);
router.get('/me', authenticate, getMe);

export default router;
