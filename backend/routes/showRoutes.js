import express from "express";
import {
  addShow,
  getAllShows,
  deleteShow,
  updateShow,
  searchShows
} from "../controllers/showController.js";

import { protectAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/add", protectAdmin, addShow);
router.get("/all", getAllShows);
router.put("/update/:id", protectAdmin, updateShow);
router.delete("/delete/:id", protectAdmin, deleteShow);

router.get("/search", searchShows);

export default router;