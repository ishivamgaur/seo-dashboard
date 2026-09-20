import { triggerRevalidate } from '../utils/revalidate.js';

// Single choke point for cache freshness: any successful content
// mutation (POST/PUT/PATCH/DELETE outside /auth) purges the
// frontend static cache in the background.
const revalidateAfterMutation = (req, res, next) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) && !req.path.startsWith('/auth')) {
    res.on('finish', () => {
      if (res.statusCode < 400) triggerRevalidate();
    });
  }
  next();
};

export { revalidateAfterMutation };
export default revalidateAfterMutation;
