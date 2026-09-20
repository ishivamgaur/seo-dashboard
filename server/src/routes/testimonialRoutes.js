import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import { testimonialUpload } from "../middleware/upload.js";
import * as testimonialController from "../controllers/testimonialController.js";

const router = Router();

router.get("/", testimonialController.getAll);
router.post(
  "/",
  authenticate,
  testimonialUpload.single("customerImage"),
  testimonialController.create
);
router.put(
  "/:id",
  authenticate,
  testimonialUpload.single("customerImage"),
  testimonialController.update
);
router.delete("/:id", authenticate, authorize("admin"), testimonialController.remove);

export default router;
