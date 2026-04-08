import mongoose from "mongoose";
import Movie from "../models/Movie.js";


// ================= ADD MOVIE =================
export const addShow = async (req, res) => {
  try {

    const movieData = { ...req.body };

    if (!movieData.title) {
      return res.status(400).json({
        success: false,
        message: "Movie title is required"
      });
    }

    const existingMovie = await Movie.findOne({ title: movieData.title });

    if (existingMovie) {
      return res.json({
        success: false,
        message: "Movie already exists"
      });
    }

    // Convert genres → array
    if (typeof movieData.genres === "string") {
      movieData.genres = movieData.genres
        .split(",")
        .map(g => g.trim());
    }

    // Ensure vote_average is number
    if (movieData.vote_average) {
      movieData.vote_average = Number(movieData.vote_average);
    }

    const newMovie = await Movie.create(movieData);

    res.json({
      success: true,
      message: "Movie added successfully",
      movie: newMovie
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



// ================= GET ALL MOVIES =================
export const getAllShows = async (req, res) => {
  try {

    const movies = await Movie.find().sort({ createdAt: -1 });

    // Cache at Vercel's edge for 5 minutes, serve stale for 10 more while revalidating
    res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');

    res.json({
      success: true,
      movies
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



// ================= UPDATE MOVIE =================
export const updateShow = async (req, res) => {
  try {

    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid movie ID"
      });
    }

    const updateData = { ...req.body };

    // Convert genres if string
    if (typeof updateData.genres === "string") {
      updateData.genres = updateData.genres
        .split(",")
        .map(g => g.trim());
    }

    // Ensure rating number
    if (updateData.vote_average) {
      updateData.vote_average = Number(updateData.vote_average);
    }

    const updatedMovie = await Movie.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedMovie) {
      return res.json({
        success: false,
        message: "Movie not found"
      });
    }

    res.json({
      success: true,
      message: "Movie updated successfully",
      movie: updatedMovie
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



// ================= DELETE MOVIE =================
export const deleteShow = async (req, res) => {
  try {

    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid movie ID"
      });
    }

    const movie = await Movie.findByIdAndDelete(id);

    if (!movie) {
      return res.json({
        success: false,
        message: "Movie not found"
      });
    }

    res.json({
      success: true,
      message: "Movie deleted successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



// ================= SEARCH MOVIES =================
export const searchShows = async (req, res) => {
  try {

    const query = req.query.q?.trim();

    if (!query) {
      return res.json({
        success: true,
        movies: []
      });
    }

    const movies = await Movie.find({
      title: { $regex: query, $options: "i" }
    })
    .limit(20)
    .sort({ createdAt: -1 });

    // Search results can be cached briefly
    res.set('Cache-Control', 'public, max-age=60');

    res.json({
      success: true,
      movies
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};