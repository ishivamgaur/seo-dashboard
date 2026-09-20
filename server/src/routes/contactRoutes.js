import express from "express";
import { getContact, updateContact } from "../controllers/contactController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

router.get("/", getContact);
router.put("/", authenticate, updateContact);

export default router;
