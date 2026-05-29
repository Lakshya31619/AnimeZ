import mongoose from "mongoose";
import Comment from "../models/Comment.js";
import User from "../models/User.js";
import { clerkClient } from "@clerk/express";

/* Helper: get or create user in DB */
const getOrCreateUser = async (userId) => {
  let user = await User.findOne({ clerkId: userId });
  if (!user) {
    const clerkUser = await clerkClient.users.getUser(userId);
    user = await User.create({
      clerkId: userId,
      name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
      email: clerkUser.emailAddresses[0].emailAddress,
      image: clerkUser.imageUrl,
      favorites: [],
      watchlist: []
    });
  }
  return user;
};

// ================= GET COMMENTS FOR CONTENT =================
export const getCommentsByContent = async (req, res) => {
  try {
    const { contentId } = req.params;
    const { type } = req.query; // "episode" or "movie"

    if (!contentId || !mongoose.Types.ObjectId.isValid(contentId)) {
      return res.status(400).json({ success: false, message: "Invalid content ID" });
    }

    const filter = { contentId };
    if (type) filter.contentType = type;

    const comments = await Comment.find(filter)
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({ success: true, comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= ADD COMMENT =================
export const addComment = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { contentId, contentType, text } = req.body;

    if (!contentId || !mongoose.Types.ObjectId.isValid(contentId)) {
      return res.status(400).json({ success: false, message: "Invalid content ID" });
    }

    if (!["episode", "movie"].includes(contentType)) {
      return res.status(400).json({ success: false, message: "Invalid content type" });
    }

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ success: false, message: "Comment text is required" });
    }

    if (text.trim().length > 1000) {
      return res.status(400).json({ success: false, message: "Comment too long (max 1000 characters)" });
    }

    const user = await getOrCreateUser(userId);

    const comment = await Comment.create({
      contentId,
      contentType,
      userId: user._id,
      clerkId: userId,
      userName: user.name,
      userImage: user.image || "",
      text: text.trim()
    });

    res.json({ success: true, comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= DELETE COMMENT =================
export const deleteComment = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { commentId } = req.params;

    if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ success: false, message: "Invalid comment ID" });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    const user = await User.findOne({ clerkId: userId });
    const isOwner = comment.clerkId === userId;
    const isAdmin = user?.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this comment" });
    }

    await Comment.findByIdAndDelete(commentId);

    res.json({ success: true, message: "Comment deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};