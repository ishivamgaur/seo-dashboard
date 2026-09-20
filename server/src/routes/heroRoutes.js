import express from "express";
import { getHero, updateHero } from "../controllers/heroController.js";
import { authenticate } from "../middleware/authenticate.js";
import { heroUpload } from "../middleware/upload.js";

const router = express.Router();

router.get("/", getHero);
router.put("/", authenticate, heroUpload.single("bannerImage"), updateHero);

export default router;
