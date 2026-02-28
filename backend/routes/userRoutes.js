import express from "express";
import { requireAuth } from "@clerk/express";
import {
    getFavorites,
    addFavorite,
    removeFavorite
} from "../controllers/userController.js";

const router = express.Router();

router.get("/favorites", requireAuth(), getFavorites);
router.post("/add-favorite", requireAuth(), addFavorite);
router.post("/remove-favorite", requireAuth(), removeFavorite);

export default router;