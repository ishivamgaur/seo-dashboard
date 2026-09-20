import { ApiError } from "../utils/ApiError.js";

const authorize =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, "Insufficient permissions");
    }

    next();
  };

export { authorize };
export default authorize;
