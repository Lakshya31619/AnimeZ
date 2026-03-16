import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

import MovieCard from "../components/MovieCard";
import Loading from "../components/Loading";

function Search() {

  const location = useLocation();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  // get query from URL
  const query = new URLSearchParams(location.search).get("q") || "";

  useEffect(() => {

    if (!query.trim()) {
      setMovies([]);
      return;
    }

    const fetchMovies = async () => {
      try {

        setLoading(true);

        const { data } = await axios.get("/api/show/search", {
          params: { q: query }
        });

        if (data.success) {
          setMovies(data.movies);
        } else {
          setMovies([]);
        }

      } catch (error) {

        console.error("Search error:", error);
        setMovies([]);

      } finally {

        setLoading(false);

      }
    };

    fetchMovies();

  }, [query]);



  // ================= LOADING =================

  if (loading) return <Loading />;



  // ================= UI =================

  return (
    <div className="px-6 md:px-16 lg:px-36 pt-32 min-h-screen">

      <h1 className="text-xl md:text-2xl font-semibold mb-6">
        Search Results for "{query}"
      </h1>


      {movies.length === 0 ? (

        <p className="text-gray-400">
          No movies found.
        </p>

      ) : (

        <div className="flex flex-wrap gap-6">

          {movies.map((movie) => (
            <MovieCard
              key={movie._id}
              movie={movie}
            />
          ))}

        </div>

      )}

    </div>
  );

}

export default Search;