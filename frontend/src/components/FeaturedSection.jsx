import { ArrowRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BlurCircle from "./BlurCircle";
import MovieCard from "./MovieCard.jsx";
import axios from "axios";

function FeaturedSection() {

  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);

  /* ================= FETCH LATEST MOVIES ================= */

  const fetchMovies = async () => {
    try {

      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/show/all`
      );

      if (data.success) {

        // get latest 4 movies
        setMovies(data.movies.slice(0, 4));

      }

    } catch (error) {

      console.error("Error fetching movies:", error);

    }
  };

  useEffect(() => {

    fetchMovies();

  }, []);

  /* ================= NAVIGATION ================= */

  const handleViewAll = () => {
    navigate("/movies");
  };

  const handleShowMore = () => {
    navigate("/movies");
    window.scrollTo(0, 0);
  };

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden">

      {/* HEADER */}
      <div className="relative flex items-center justify-between pt-20 pb-10">

        <BlurCircle top="0" right="-80px" />

        <p className="text-gray-300 font-medium text-lg">
          Latest Releases
        </p>

        <button
          onClick={handleViewAll}
          className="group flex items-center gap-2 text-sm text-gray-300 cursor-pointer"
        >
          View All
          <ArrowRight className="group-hover:translate-x-0.5 transition w-4.5 h-4.5" />
        </button>

      </div>

      {/* MOVIE GRID */}
      <div className="flex flex-wrap max-sm:justify-center gap-8 mt-8">

        {movies.length > 0 ? (

          movies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))

        ) : (

          <p className="text-gray-400">Loading movies...</p>

        )}

      </div>

      {/* SHOW MORE BUTTON */}
      <div className="flex justify-center mt-20">

        <button
          onClick={handleShowMore}
          className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer"
        >
          Show more
        </button>

      </div>

    </div>
  );
}

export default FeaturedSection;