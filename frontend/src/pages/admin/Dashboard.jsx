import { PlayCircleIcon, StarIcon, UserIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import BlurCircle from "../../components/BlurCircle";
import MovieFilter from "../../components/MovieFilter";

function Dashboard() {

  const { getToken } = useAuth();
  const baseURL = import.meta.env.VITE_BASE_URL; // ✅ added

  const [dashboardData, setDashboardData] = useState({
    activeMovies: [],
    totalUser: 0
  });

  const [editingMovie, setEditingMovie] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("year-desc");

  const genreOptions = [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Drama",
    "Fantasy",
    "Sci-Fi",
    "Thriller"
  ];

  const dashboardCards = [
    {
      title: "Active Movies",
      value: dashboardData.activeMovies.length || "0",
      icon: PlayCircleIcon
    },
    {
      title: "Total Users",
      value: dashboardData.totalUser || "0",
      icon: UserIcon
    }
  ];

  // ================= FETCH DASHBOARD =================
  const fetchDashboardData = async () => {
    try {
      const token = await getToken();

      const res = await axios.get(
        `${baseURL}/api/admin/dashboard`, // ✅ updated
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (res.data.success) {
        setDashboardData({
          activeMovies: res.data.activeMovies,
          totalUser: res.data.totalUser
        });
      }

      setLoading(false);

    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  // ================= FETCH CHARACTERS =================
  const fetchCharacters = async () => {
    try {
      const res = await axios.get(
        `${baseURL}/api/character/all` // ✅ updated
      );

      const chars =
        res.data.characters ||
        res.data.casts ||
        res.data.data ||
        [];

      setCharacters(chars);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchCharacters();
  }, []);

  // ================= DELETE MOVIE =================
  const handleDelete = async (id) => {
    try {
      const token = await getToken();

      await axios.delete(
        `${baseURL}/api/show/delete/${id}`, // ✅ updated
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      fetchDashboardData();

    } catch (error) {
      console.error(error);
    }
  };

  // ================= UPDATE MOVIE =================
  const handleUpdate = async () => {
    try {
      const token = await getToken();

      const payload = {
        ...editingMovie,
        casts: (editingMovie.casts || []).map((c) =>
          typeof c === "string" ? c : c._id
        ),
        genres: Array.isArray(editingMovie.genres)
          ? editingMovie.genres
          : []
      };

      await axios.put(
        `${baseURL}/api/show/update/${editingMovie._id}`, // ✅ updated
        payload,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setEditingMovie(null);
      fetchDashboardData();

    } catch (error) {
      console.error(error);
    }
  };

  // ================= FILTER =================
  const filteredMovies = [...dashboardData.activeMovies]
    .filter((movie) =>
      movie.title?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "year-desc") {
        return new Date(b.release_date) - new Date(a.release_date);
      }
      if (sort === "year-asc") {
        return new Date(a.release_date) - new Date(b.release_date);
      }
      if (sort === "name-asc") {
        return a.title.localeCompare(b.title);
      }
      if (sort === "name-desc") {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });

  return !loading ? (
    <>
      <Title text1="Admin" text2="Dashboard" />

      {/* DASHBOARD CARDS */}
      <div className="relative flex flex-wrap gap-4 mt-6">
        <BlurCircle top="-100px" left="0" />

        {dashboardCards.map((card, index) => (
          <div
            key={index}
            className="flex items-center justify-between px-4 py-3 bg-primary/10 border border-primary/20 rounded-md max-w-50 w-full"
          >
            <div>
              <h1 className="text-sm">{card.title}</h1>
              <p className="text-xl font-medium mt-1">{card.value}</p>
            </div>
            <card.icon className="w-6 h-6" />
          </div>
        ))}
      </div>

      <p className="mt-10 text-lg font-medium">Active Movies</p>

      <MovieFilter
        search={search}
        setSearch={setSearch}
        sort={sort}
        setSort={setSort}
      />

      {/* MOVIES GRID */}
      <div className="relative flex flex-wrap gap-6 mt-6 max-w-5xl">
        <BlurCircle top="100px" left="-10%" />

        {filteredMovies.map((movie) => (
          <div
            key={movie._id}
            className="w-55 rounded-lg overflow-hidden pb-3 bg-primary/10 border border-primary/20"
          >
            <img
              src={movie.backdrop_path}
              alt=""
              className="h-60 w-full object-cover"
            />

            <p className="font-medium p-2 truncate">{movie.title}</p>

            <div className="flex items-center justify-between px-2">
              <p className="flex items-center gap-1 text-sm text-gray-400">
                <StarIcon className="w-4 h-4 text-primary fill-primary" />
                {movie.vote_average?.toFixed(1)}
              </p>
            </div>

            <p className="px-2 pt-2 text-sm text-gray-500">
              {movie.runtime}
            </p>

            <div className="flex gap-2 px-2 mt-3">
              <button
                onClick={() =>
                  setEditingMovie({
                    ...movie,
                    genres: Array.isArray(movie.genres) ? movie.genres : [],
                    casts: Array.isArray(movie.casts) ? movie.casts : []
                  })
                }
                className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(movie._id)}
                className="bg-red-500 text-white px-2 py-1 rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT MODAL */}
      {editingMovie && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-[#0f172a] text-white p-6 rounded-xl w-[650px] max-h-[90vh] overflow-y-auto border border-primary/30 shadow-xl">

            <h2 className="text-2xl font-semibold mb-6 text-primary">
              Edit Movie
            </h2>

            <input
              type="text"
              value={editingMovie.title}
              onChange={(e) =>
                setEditingMovie({ ...editingMovie, title: e.target.value })
              }
              className="w-full bg-black/40 border p-3 rounded-md mb-3"
            />

            <textarea
              value={editingMovie.overview}
              onChange={(e) =>
                setEditingMovie({ ...editingMovie, overview: e.target.value })
              }
              className="w-full bg-black/40 border p-3 rounded-md mb-3"
            />

            <input
              type="text"
              value={editingMovie.backdrop_path}
              onChange={(e) =>
                setEditingMovie({ ...editingMovie, backdrop_path: e.target.value })
              }
              className="w-full bg-black/40 border p-3 rounded-md mb-3"
            />

            <input
              type="text"
              value={editingMovie.background_path}
              onChange={(e) =>
                setEditingMovie({ ...editingMovie, background_path: e.target.value })
              }
              className="w-full bg-black/40 border p-3 rounded-md mb-3"
            />

            <input
              type="text"
              value={editingMovie.movie_link}
              onChange={(e) =>
                setEditingMovie({ ...editingMovie, movie_link: e.target.value })
              }
              className="w-full bg-black/40 border p-3 rounded-md mb-4"
            />

            {/* GENRES */}
            <div className="flex flex-wrap gap-2 mb-4">
              {genreOptions.map((genre) => {
                const selected = editingMovie.genres?.includes(genre);

                return (
                  <button
                    key={genre}
                    onClick={() => {
                      if (selected) {
                        setEditingMovie({
                          ...editingMovie,
                          genres: editingMovie.genres.filter(g => g !== genre)
                        });
                      } else {
                        setEditingMovie({
                          ...editingMovie,
                          genres: [...(editingMovie.genres || []), genre]
                        });
                      }
                    }}
                    className={`px-3 py-1 rounded-full border ${
                      selected ? "bg-primary text-black" : ""
                    }`}
                  >
                    {genre}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setEditingMovie(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="bg-primary px-5 py-2 rounded"
              >
                Update Movie
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  ) : (
    <Loading />
  );
}

export default Dashboard;