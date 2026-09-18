import { Router } from 'express';

import authRoutes from './authRoutes.js';
import seoRoutes from './seoRoutes.js';
import schemaRoutes from './schemaRoutes.js';
import heroRoutes from './heroRoutes.js';
import aboutRoutes from './aboutRoutes.js';
import vehicleRoutes from './vehicleRoutes.js';
import occasionRoutes from './occasionRoutes.js';
import testimonialRoutes from './testimonialRoutes.js';
import galleryRoutes from './galleryRoutes.js';
import contactRoutes from './contactRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/seo', seoRoutes);
router.use('/schemas', schemaRoutes);
router.use('/schema', schemaRoutes);
router.use('/hero', heroRoutes);
router.use('/about', aboutRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/occasions', occasionRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/gallery', galleryRoutes);
router.use('/contact', contactRoutes);

export default router;
