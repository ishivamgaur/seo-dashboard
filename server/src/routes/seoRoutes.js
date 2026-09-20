import { Router } from "express";
import { getSeo, updateSeo } from "../controllers/seoController.js";
import { authenticate } from "../middleware/authenticate.js";
import { createUploader } from "../middleware/upload.js";

const router = Router();
const seoUpload = createUploader("seo", "social");

router.get("/", getSeo);
router.put(
  "/",
  authenticate,
  seoUpload.fields([
    { name: "ogImageFile", maxCount: 1 },
    { name: "twitterImageFile", maxCount: 1 },
  ]),
  updateSeo
);

export default router;
