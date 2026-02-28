import express from "express";
import { requireAuth } from "@clerk/express";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist
} from "../controllers/userController.js";

const router = express.Router();

// Favorites
router.get("/favorites", requireAuth(), getFavorites);
router.post("/add-favorite", requireAuth(), addFavorite);
router.post("/remove-favorite", requireAuth(), removeFavorite);

// Watchlist
router.get("/watchlist", requireAuth(), getWatchlist);
router.post("/add-watchlist", requireAuth(), addToWatchlist);
router.post("/remove-watchlist", requireAuth(), removeFromWatchlist);

export default router;