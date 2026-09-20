import { validationResult } from "express-validator";

import { ApiError } from "../utils/ApiError.js";

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
    }));

    throw ApiError.badRequest("Validation failed", formattedErrors);
  }

  next();
};

export { validate };
export default validate;
