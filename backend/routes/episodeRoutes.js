import express from "express";
import {
  addEpisode,
  getAllEpisodes,
  getEpisodesBySeries,
  getEpisodeById,
  updateEpisode,
  deleteEpisode
} from "../controllers/episodeController.js";

import { protectAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/add", protectAdmin, addEpisode);
router.get("/all", getAllEpisodes);
router.get("/series/:series", getEpisodesBySeries);
router.get("/:id", getEpisodeById);
router.put("/update/:id", protectAdmin, updateEpisode);
router.delete("/delete/:id", protectAdmin, deleteEpisode);

export default router;
