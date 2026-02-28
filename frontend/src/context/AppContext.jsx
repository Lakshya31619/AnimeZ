import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const [isAdmin, setIsAdmin] = useState(false);
    const [favoriteMovies, setFavoriteMovies] = useState([]);

    const { user } = useUser();
    const { getToken } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const fetchisAdmin = async () => {
        try {
            const { data } = await axios.get(
                '/api/admin/is-admin',
                { headers: { Authorization: `Bearer ${await getToken()}` } }
            );

            setIsAdmin(data.isAdmin);

            if (!data.isAdmin && location.pathname.startsWith('/admin')) {
                navigate('/');
                toast.error('Not authorized');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchFavoriteMovies = async () => {
        try {
            const { data } = await axios.get(
                '/api/user/favorites',
                { headers: { Authorization: `Bearer ${await getToken()}` } }
            );

            if (data.success) {
                setFavoriteMovies(data.movies);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.error(error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Server error");
        }
    };

    const addToFavorites = async (movieId) => {
        try {
            const { data } = await axios.post(
                '/api/user/add-favorite',
                { movieId },
                { headers: { Authorization: `Bearer ${await getToken()}` } }
            );

            if (data.success) {
                fetchFavoriteMovies();
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.error(error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Server error");
        }
    };

    const removeFromFavorites = async (movieId) => {
        try {
            const { data } = await axios.post(
                '/api/user/remove-favorite',
                { movieId },
                { headers: { Authorization: `Bearer ${await getToken()}` } }
            );

            if (data.success) {
                fetchFavoriteMovies();
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.error(error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Server error");
        }
    };

    const isFavorite = (movieId) => {
        return favoriteMovies.some(movie => movie._id === movieId);
    };

    useEffect(() => {
        if (user) {
            fetchisAdmin();
            fetchFavoriteMovies();
        }
    }, [user]);

    const value = {
        axios,
        user,
        getToken,
        navigate,
        isAdmin,
        favoriteMovies,
        fetchFavoriteMovies,
        addToFavorites,
        removeFromFavorites,
        isFavorite
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);