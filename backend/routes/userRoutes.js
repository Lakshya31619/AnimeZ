import express from "express";
import { requireAuth } from "@clerk/express";
import { protectAdmin } from "../middleware/auth.js";
import User from "../models/User.js";

import {
  getFavorites,
  addFavorite,
  removeFavorite,
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  getAllUsers
} from "../controllers/userController.js";

const router = express.Router();

/* ================= GET CURRENT USER ================= */

router.get("/me", requireAuth(), async (req, res) => {
  try {

    const { userId } = req.auth();

    const user = await User.findOne({
      clerkId: userId
    });

    if (!user) {

      return res.json({
        success: false,
        message: "User not found"
      });

    }

    res.json({
      success: true,
      user
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
});

/* ================= FAVORITES ================= */

router.get("/favorites", requireAuth(), getFavorites);
router.post("/add-favorite", requireAuth(), addFavorite);
router.post("/remove-favorite", requireAuth(), removeFavorite);

/* ================= WATCHLIST ================= */

router.get("/watchlist", requireAuth(), getWatchlist);
router.post("/add-watchlist", requireAuth(), addToWatchlist);
router.post("/remove-watchlist", requireAuth(), removeFromWatchlist);

/* ================= ADMIN ================= */

router.get("/all", requireAuth(), protectAdmin, getAllUsers);

export default router;