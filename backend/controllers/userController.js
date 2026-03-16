import User from "../models/User.js";
import Movie from "../models/Movie.js";
import { clerkClient } from "@clerk/express";

/* ================= HELPER: GET OR CREATE USER ================= */

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


/* ==================== FAVORITES ==================== */

export const getFavorites = async (req, res) => {
  try {

    const { userId } = req.auth();

    const user = await getOrCreateUser(userId);

    await user.populate("favorites");

    res.json({
      success: true,
      movies: user.favorites
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const addFavorite = async (req, res) => {
  try {

    const { userId } = req.auth();
    const { movieId } = req.body;

    const user = await getOrCreateUser(userId);

    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found"
      });
    }

    if (!user.favorites.includes(movieId)) {
      user.favorites.push(movieId);
      await user.save();
    }

    res.json({ success: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const removeFavorite = async (req, res) => {
  try {

    const { userId } = req.auth();
    const { movieId } = req.body;

    const user = await getOrCreateUser(userId);

    user.favorites = user.favorites.filter(
      id => id.toString() !== movieId
    );

    await user.save();

    res.json({ success: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


/* ==================== WATCHLIST ==================== */

export const getWatchlist = async (req, res) => {
  try {

    const { userId } = req.auth();

    const user = await getOrCreateUser(userId);

    await user.populate("watchlist");

    res.json({
      success: true,
      movies: user.watchlist
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const addToWatchlist = async (req, res) => {
  try {

    const { userId } = req.auth();
    const { movieId } = req.body;

    const user = await getOrCreateUser(userId);

    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found"
      });
    }

    if (!user.watchlist.includes(movieId)) {
      user.watchlist.push(movieId);
      await user.save();
    }

    res.json({ success: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const removeFromWatchlist = async (req, res) => {
  try {

    const { userId } = req.auth();
    const { movieId } = req.body;

    const user = await getOrCreateUser(userId);

    user.watchlist = user.watchlist.filter(
      id => id.toString() !== movieId
    );

    await user.save();

    res.json({ success: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


/* ==================== ADMIN ==================== */

export const getAllUsers = async (req, res) => {
  try {

    const users = await User.find();

    res.json({
      success: true,
      totalUsers: users.length,
      users
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};