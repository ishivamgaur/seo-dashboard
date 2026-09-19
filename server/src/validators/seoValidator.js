import { body } from 'express-validator';

export const seoUpdateRules = [
  body('metaTitle').optional().isString().isLength({ max: 255 }).withMessage('Max 255 characters'),
  body('metaDescription')
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage('Max 500 characters'),
  body('canonicalUrl').optional().isURL().withMessage('Valid URL required'),
  body('robotsIndex').optional().isBoolean().withMessage('Boolean required'),
  body('robotsFollow').optional().isBoolean().withMessage('Boolean required'),
];
