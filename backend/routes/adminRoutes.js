import express from "express";
import { requireAuth } from "@clerk/express";
import { protectAdmin } from "../middleware/auth.js";
import { getDashboardData, getAllComments, adminDeleteComment } from "../controllers/adminController.js";

const router = express.Router();

router.get("/dashboard",         requireAuth(), getDashboardData);
router.get("/comments",          requireAuth(), protectAdmin, getAllComments);
router.delete("/comments/:commentId", requireAuth(), protectAdmin, adminDeleteComment);

export default router;