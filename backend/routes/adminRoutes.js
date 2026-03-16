import express from "express";
import { requireAuth } from "@clerk/express";
import { getDashboardData } from "../controllers/adminController.js";

const router = express.Router();

router.get("/dashboard", requireAuth(), getDashboardData);

export default router;