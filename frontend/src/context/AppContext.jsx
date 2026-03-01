import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {

  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [watchList, setWatchList] = useState([]);

  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  // ================= FAVORITES =================

  const fetchFavoriteMovies = async () => {
    try {
      const { data } = await axios.get("/api/user/favorites", {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });

      if (data.success) {
        setFavoriteMovies(data.movies);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addToFavorites = async (movieId) => {
    await axios.post("/api/user/add-favorite",
      { movieId },
      { headers: { Authorization: `Bearer ${await getToken()}` } }
    );
    fetchFavoriteMovies();
  };

  const removeFromFavorites = async (movieId) => {
    await axios.post("/api/user/remove-favorite",
      { movieId },
      { headers: { Authorization: `Bearer ${await getToken()}` } }
    );
    fetchFavoriteMovies();
  };

  const isFavorite = (movieId) =>
    favoriteMovies.some(movie => movie._id === movieId);

  // ================= WATCHLIST =================

  const fetchWatchList = async () => {
    try {
      const { data } = await axios.get("/api/user/watchlist", {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });

      if (data.success) {
        setWatchList(data.movies);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addToWatchList = async (movieId) => {
    await axios.post("/api/user/add-watchlist",
      { movieId },
      { headers: { Authorization: `Bearer ${await getToken()}` } }
    );
    fetchWatchList();
  };

  const removeFromWatchList = async (movieId) => {
    await axios.post("/api/user/remove-watchlist",
      { movieId },
      { headers: { Authorization: `Bearer ${await getToken()}` } }
    );
    fetchWatchList();
  };

  const isInWatchList = (movieId) =>
    watchList.some(movie => movie._id === movieId);

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