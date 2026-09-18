import multer from 'multer';
import { ValidationError } from 'sequelize';

import { config } from '../config/environment.js';
import { ApiError } from '../utils/ApiError.js';

// Express identifies error middleware by 4-parameter signature
const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = 'Internal server error';
  let errors = [];

  if (err instanceof ApiError || err.isOperational) {
    statusCode = err.statusCode || 400;
    message = err.message;
    errors = err.errors || [];
  } else if (err instanceof ValidationError || err.name?.startsWith('Sequelize')) {
    statusCode = 400;
    message = 'Database validation error';
    errors = err.errors?.map((item) => ({
      field: item.path,
      message: item.message,
    })) || [];
  } else if (err instanceof multer.MulterError) {
    statusCode = 400;
    message = err.code === 'LIMIT_FILE_SIZE'
      ? 'File too large. Maximum allowed size is 5MB.'
      : err.message;
    errors = [{ field: err.field || 'file', message: err.message }];
  } else if (config.env === 'development') {
    // Expose root cause in development to accelerate debugging
    message = err.message || message;
  }

  const response = {
    success: false,
    message,
    errors,
    ...(config.env === 'development' && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};

export { errorHandler };
export default errorHandler;
