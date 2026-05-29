import express from "express";
import { requireAuth } from "@clerk/express";
import {
  getCommentsByContent,
  addComment,
  deleteComment
} from "../controllers/commentController.js";

const router = express.Router();

// Public: anyone can read comments
router.get("/:contentId", getCommentsByContent);

// Protected: only logged-in users can post or delete
router.post("/add", requireAuth(), addComment);
router.delete("/delete/:commentId", requireAuth(), deleteComment);

export default router;