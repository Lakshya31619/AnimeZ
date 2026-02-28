import User from "../models/User.js";

// ==================== FAVORITES ====================

export const getFavorites = async (req, res) => {
  try {
    const { userId } = req.auth();

    const user = await User.findById(userId).populate("favorites");

    res.json({
      success: true,
      movies: user?.favorites || []
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const addFavorite = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { movieId } = req.body;

    const user = await User.findById(userId);

    if (!user.favorites.includes(movieId)) {
      user.favorites.push(movieId);
      await user.save();
    }

    res.json({ success: true });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { movieId } = req.body;

    const user = await User.findById(userId);

    user.favorites = user.favorites.filter(id => id !== movieId);
    await user.save();

    res.json({ success: true });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ==================== WATCHLIST ====================

export const getWatchlist = async (req, res) => {
  try {
    const { userId } = req.auth();

    const user = await User.findById(userId).populate("watchlist");

    res.json({
      success: true,
      movies: user?.watchlist || []
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const addToWatchlist = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { movieId } = req.body;

    const user = await User.findById(userId);

    if (!user.watchlist.includes(movieId)) {
      user.watchlist.push(movieId);
      await user.save();
    }

    res.json({ success: true });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const removeFromWatchlist = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { movieId } = req.body;

    const user = await User.findById(userId);

    user.watchlist = user.watchlist.filter(id => id !== movieId);
    await user.save();

    res.json({ success: true });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};