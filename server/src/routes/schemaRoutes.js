import { Router } from "express";
import {
  getAll,
  getOne,
  create,
  update,
  remove,
  toggleActive,
} from "../controllers/schemaController.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";

const router = Router();

router.get("/", getAll);
router.get("/:id", getOne);
router.post("/", authenticate, create);
router.put("/:id", authenticate, update);
router.delete("/:id", authenticate, authorize("admin"), remove);
router.patch("/:id/toggle", authenticate, toggleActive);

export default router;
