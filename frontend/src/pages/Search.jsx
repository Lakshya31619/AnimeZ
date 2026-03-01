import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import Loading from "../components/Loading";
import axios from "axios";

function Search() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);

        const baseURL = import.meta.env.VITE_BASE_URL;

        console.log("BASE URL:", baseURL);

        const fullURL = `${baseURL}/api/show/search?q=${query}`;

        console.log("Full URL:", fullURL);

        const { data } = await axios.get(fullURL);

        setMovies(data);
      } catch (error) {
        console.log("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchMovies();
  }, [query]);

  if (loading) return <Loading />;

  return (
    <div className="px-6 md:px-16 lg:px-36 pt-32 min-h-screen">
      <h1 className="text-xl font-semibold mb-6">
        Search Results for "{query}"
      </h1>

      {movies.length === 0 ? (
        <p className="text-gray-400">No movies found.</p>
      ) : (
        <div className="flex flex-wrap gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Search;