import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [watchList, setWatchList] = useState([]);

  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  // ================= FETCH LOGGED IN USER FROM BACKEND =================

  const fetchUserFromDB = async () => {
    try {
      const token = await getToken();

      const { data } = await axios.get("/api/user/me", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setDbUser(data.user);
      } else {
        setDbUser(null);
      }
    } catch (error) {
      console.error(error);
      setDbUser(null);
    } finally {
      setLoading(false);
    }
  };

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
    await axios.post(
      "/api/user/add-favorite",
      { movieId },
      { headers: { Authorization: `Bearer ${await getToken()}` } }
    );
    fetchFavoriteMovies();
  };

  const removeFromFavorites = async (movieId) => {
    await axios.post(
      "/api/user/remove-favorite",
      { movieId },
      { headers: { Authorization: `Bearer ${await getToken()}` } }
    );
    fetchFavoriteMovies();
  };

  const isFavorite = (movieId) =>
    favoriteMovies.some((movie) => movie._id === movieId);

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
    await axios.post(
      "/api/user/add-watchlist",
      { movieId },
      { headers: { Authorization: `Bearer ${await getToken()}` } }
    );
    fetchWatchList();
  };

  const removeFromWatchList = async (movieId) => {
    await axios.post(
      "/api/user/remove-watchlist",
      { movieId },
      { headers: { Authorization: `Bearer ${await getToken()}` } }
    );
    fetchWatchList();
  };

  const isInWatchList = (movieId) =>
    watchList.some((movie) => movie._id === movieId);

  // ================= EFFECT =================

  useEffect(() => {
    if (user) {
      fetchUserFromDB();
      fetchFavoriteMovies();
      fetchWatchList();
    } else {
      setDbUser(null);
      setLoading(false);
    }
  }, [user]);

  const value = {
    navigate,
    user: dbUser, // ✅ THIS FIXES YOUR ADMIN CHECK
    loading,      // ✅ THIS PREVENTS LOOP
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