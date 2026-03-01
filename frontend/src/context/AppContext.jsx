// AppContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

// Use react-hot-toast for notifications
import toast from "react-hot-toast";

// ================= BASE URL =================
// Use VITE_API_URL for production, fallback to localhost in dev
axios.defaults.baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [watchList, setWatchList] = useState([]);

  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  // ================= Helper: Auth Header =================
  const getAuthHeader = async () => {
    const token = await getToken();
    return { Authorization: `Bearer ${token}` };
  };

  // ================= FAVORITES =================
  const fetchFavoriteMovies = async () => {
    try {
      const { data } = await axios.get("/api/user/favorites", {
        headers: await getAuthHeader()
      });
      if (data.success) setFavoriteMovies(data.movies);
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
      toast.error("Failed to load favorite movies");
    }
  };

  const addToFavorites = async (movieId) => {
    try {
      await axios.post("/api/user/add-favorite",
        { movieId },
        { headers: await getAuthHeader() }
      );
      fetchFavoriteMovies();
      toast.success("Added to favorites!");
    } catch (error) {
      console.error("Failed to add favorite:", error);
      toast.error("Failed to add to favorites");
    }
  };

  const removeFromFavorites = async (movieId) => {
    try {
      await axios.post("/api/user/remove-favorite",
        { movieId },
        { headers: await getAuthHeader() }
      );
      fetchFavoriteMovies();
      toast.success("Removed from favorites!");
    } catch (error) {
      console.error("Failed to remove favorite:", error);
      toast.error("Failed to remove from favorites");
    }
  };

  const isFavorite = (movieId) =>
    favoriteMovies.some(movie => movie._id === movieId);

  // ================= WATCHLIST =================
  const fetchWatchList = async () => {
    try {
      const { data } = await axios.get("/api/user/watchlist", {
        headers: await getAuthHeader()
      });
      if (data.success) setWatchList(data.movies);
    } catch (error) {
      console.error("Failed to fetch watchlist:", error);
      toast.error("Failed to load watchlist");
    }
  };

  const addToWatchList = async (movieId) => {
    try {
      await axios.post("/api/user/add-watchlist",
        { movieId },
        { headers: await getAuthHeader() }
      );
      fetchWatchList();
      toast.success("Added to watchlist!");
    } catch (error) {
      console.error("Failed to add watchlist:", error);
      toast.error("Failed to add to watchlist");
    }
  };

  const removeFromWatchList = async (movieId) => {
    try {
      await axios.post("/api/user/remove-watchlist",
        { movieId },
        { headers: await getAuthHeader() }
      );
      fetchWatchList();
      toast.success("Removed from watchlist!");
    } catch (error) {
      console.error("Failed to remove watchlist:", error);
      toast.error("Failed to remove from watchlist");
    }
  };

  const isInWatchList = (movieId) =>
    watchList.some(movie => movie._id === movieId);

  // ================= Effect: Fetch on User Login =================
  useEffect(() => {
    if (user) {
      fetchFavoriteMovies();
      fetchWatchList();
    }
  }, [user]);

  const value = {
    navigate,
    favoriteMovies,
    watchList,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    addToWatchList,
    removeFromWatchList,
    isInWatchList
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);