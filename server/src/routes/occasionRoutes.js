import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import { occasionUpload } from "../middleware/upload.js";
import * as occasionController from "../controllers/occasionController.js";

const router = Router();

router.get("/", occasionController.getAll);
router.post("/", authenticate, occasionUpload.single("image"), occasionController.create);
router.put("/:id", authenticate, occasionUpload.single("image"), occasionController.update);
router.delete("/:id", authenticate, authorize("admin"), occasionController.remove);
router.patch("/reorder", authenticate, occasionController.reorder);

export default router;
