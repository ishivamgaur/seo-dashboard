import jwt from 'jsonwebtoken';

import { config } from '../config/environment.js';
import { ApiError } from '../utils/ApiError.js';

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw ApiError.unauthorized('Authentication required. No token provided.');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    next();
  } catch {
    // Catch token verification failures such as expiration or signature mismatch
    throw ApiError.unauthorized('Invalid or expired token.');
  }
};

export { authenticate };
export default authenticate;
