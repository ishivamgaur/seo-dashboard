import { Router } from "express";
import { uploadImage } from "../controllers/uploadController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

router.post("/", authenticate, ...uploadImage);

export default router;
