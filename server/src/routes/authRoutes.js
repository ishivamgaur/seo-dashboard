import { Router } from "express";
import { login, getMe } from "../controllers/authController.js";
import { authenticate } from "../middleware/authenticate.js";
import { validate } from "../middleware/validate.js";
import { loginRules } from "../validators/authValidator.js";

const router = Router();

router.post("/login", loginRules, validate, login);
router.get("/me", authenticate, getMe);

export default router;
