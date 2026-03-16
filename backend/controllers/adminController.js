import Movie from "../models/Movie.js";
import User from "../models/User.js";

export const getDashboardData = async (req, res) => {
  try {

    const activeMovies = await Movie.find({});

    const totalUser = await User.countDocuments();

    res.json({
      success: true,
      activeMovies,
      totalUser
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};