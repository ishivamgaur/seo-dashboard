import express from 'express';
import { getAbout, updateAbout } from '../controllers/aboutController.js';
import { authenticate } from '../middleware/authenticate.js';
import { createUploader } from '../middleware/upload.js';

const router = express.Router();
const aboutUpload = createUploader('about');

router.get('/', getAbout);
router.put('/', authenticate, aboutUpload.single('featuredImage'), updateAbout);

export default router;
