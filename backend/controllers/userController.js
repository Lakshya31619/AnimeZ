import User from "../models/User.js";
import Movie from "../models/Movie.js";

export const getFavorites = async (req, res) => {
    try {
        const userId = req.auth.userId;

        const user = await User.findById(userId).populate("favorites");

        if (!user) {
            return res.json({ success: true, movies: [] });
        }

        res.json({
            success: true,
            movies: user.favorites || []
        });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

export const addFavorite = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { movieId } = req.body;

        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.json({ success: false, message: "Movie not found in DB" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (!user.favorites.includes(movieId)) {
            user.favorites.push(movieId);
            await user.save();
        }

        res.json({
            success: true,
            message: "Movie added to favorites"
        });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

export const removeFavorite = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { movieId } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        user.favorites = user.favorites.filter(
            fav => fav !== movieId
        );

        await user.save();

        res.json({
            success: true,
            message: "Movie removed from favorites"
        });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};