import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import { vehicleUpload } from "../middleware/upload.js";
import * as vehicleController from "../controllers/vehicleController.js";

const router = Router();

router.get("/", vehicleController.getAll);
router.get("/:id", vehicleController.getOne);
router.post("/", authenticate, vehicleUpload.single("image"), vehicleController.create);
router.put("/:id", authenticate, vehicleUpload.single("image"), vehicleController.update);
router.delete("/:id", authenticate, authorize("admin"), vehicleController.remove);
router.patch("/reorder", authenticate, vehicleController.reorder);

export default router;
