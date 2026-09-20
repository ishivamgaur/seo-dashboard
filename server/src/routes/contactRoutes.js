import express from "express";
import { getContact, updateContact, sendInquiry } from "../controllers/contactController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

router.get("/", getContact);
router.post("/inquiry", sendInquiry);
router.put("/", authenticate, updateContact);

export default router;
