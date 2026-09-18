import { body } from 'express-validator';

export const vehicleRules = [
  body('vehicleName').notEmpty().withMessage('Vehicle name required').isLength({ max: 200 }).withMessage('Max 200 characters'),
  body('seatingCapacity').notEmpty().withMessage('Seating capacity required').isInt({ min: 1 }).withMessage('Min capacity is 1'),
  body('description').optional().isString()
];
