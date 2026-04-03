import mongoose from "mongoose";
import Episode from "../models/Episode.js";

// ================= ADD EPISODE =================
export const addEpisode = async (req, res) => {
  try {
    const episodeData = { ...req.body };

    if (!episodeData.title || !episodeData.series || !episodeData.episode_link) {
      return res.status(400).json({
        success: false,
        message: "Title, series, and episode link are required"
      });
    }

    if (episodeData.episode_number) {
      episodeData.episode_number = Number(episodeData.episode_number);
    }

    const newEpisode = await Episode.create(episodeData);

    res.json({
      success: true,
      message: "Episode added successfully",
      episode: newEpisode
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= GET ALL EPISODES =================
export const getAllEpisodes = async (req, res) => {
  try {
    const episodes = await Episode.find().sort({ series: 1, episode_number: 1 });

    res.json({ success: true, episodes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= GET EPISODES BY SERIES =================
export const getEpisodesBySeries = async (req, res) => {
  try {
    const { series } = req.params;
    const decodedSeries = decodeURIComponent(series);

    const episodes = await Episode.find({ series: decodedSeries }).sort({ episode_number: 1 });

    res.json({ success: true, episodes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= GET SINGLE EPISODE =================
export const getEpisodeById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid episode ID" });
    }

    const episode = await Episode.findById(id);

    if (!episode) {
      return res.json({ success: false, message: "Episode not found" });
    }

    res.json({ success: true, episode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= UPDATE EPISODE =================
export const updateEpisode = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid episode ID" });
    }

    const updateData = { ...req.body };

    if (updateData.episode_number) {
      updateData.episode_number = Number(updateData.episode_number);
    }

    const updated = await Episode.findByIdAndUpdate(id, updateData, { new: true });

    if (!updated) {
      return res.json({ success: false, message: "Episode not found" });
    }

    res.json({ success: true, message: "Episode updated successfully", episode: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= DELETE EPISODE =================
export const deleteEpisode = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid episode ID" });
    }

    const episode = await Episode.findByIdAndDelete(id);

    if (!episode) {
      return res.json({ success: false, message: "Episode not found" });
    }

    res.json({ success: true, message: "Episode deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
