import { param } from 'express-validator';

export const idParamRule = [
  param('id').isInt().withMessage('Valid ID required')
];
